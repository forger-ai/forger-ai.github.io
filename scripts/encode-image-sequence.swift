import AVFoundation
import CoreImage
import Foundation

enum EncoderError: Error, CustomStringConvertible {
  case invalidArguments
  case noFrames
  case cannotCreateWriter
  case cannotCreatePixelBuffer
  case cannotLoadFrame(String)
  case appendFailed(String)

  var description: String {
    switch self {
    case .invalidArguments:
      return "Usage: encode-image-sequence.swift <frames-dir> <output.mp4> <fps> <width> <height>"
    case .noFrames:
      return "No JPEG frames were found."
    case .cannotCreateWriter:
      return "Could not create the video writer."
    case .cannotCreatePixelBuffer:
      return "Could not create a video pixel buffer."
    case .cannotLoadFrame(let path):
      return "Could not load frame: \(path)"
    case .appendFailed(let path):
      return "Could not append frame: \(path)"
    }
  }
}

func run() throws {
  let arguments = CommandLine.arguments
  guard arguments.count == 6,
        let fps = Int32(arguments[3]), fps > 0,
        let width = Int(arguments[4]), width > 0,
        let height = Int(arguments[5]), height > 0 else {
    throw EncoderError.invalidArguments
  }

  let framesDirectory = URL(fileURLWithPath: arguments[1], isDirectory: true)
  let outputUrl = URL(fileURLWithPath: arguments[2])
  let frames = try FileManager.default.contentsOfDirectory(
    at: framesDirectory,
    includingPropertiesForKeys: nil
  )
    .filter { $0.pathExtension.lowercased() == "jpg" }
    .sorted { $0.lastPathComponent < $1.lastPathComponent }

  guard !frames.isEmpty else { throw EncoderError.noFrames }

  try? FileManager.default.removeItem(at: outputUrl)
  let writer = try AVAssetWriter(outputURL: outputUrl, fileType: .mp4)
  let compression: [String: Any] = [
    AVVideoAverageBitRateKey: 4_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
  ]
  let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: compression,
  ]
  let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
  input.expectsMediaDataInRealTime = false
  let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
      kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
      kCVPixelBufferWidthKey as String: width,
      kCVPixelBufferHeightKey as String: height,
    ]
  )

  guard writer.canAdd(input) else { throw EncoderError.cannotCreateWriter }
  writer.add(input)
  guard writer.startWriting() else { throw writer.error ?? EncoderError.cannotCreateWriter }
  writer.startSession(atSourceTime: .zero)

  let context = CIContext(options: [.cacheIntermediates: false])
  let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)

  for (index, frameUrl) in frames.enumerated() {
    while !input.isReadyForMoreMediaData {
      Thread.sleep(forTimeInterval: 0.002)
    }
    guard let image = CIImage(contentsOf: frameUrl) else {
      throw EncoderError.cannotLoadFrame(frameUrl.path)
    }

    var pixelBuffer: CVPixelBuffer?
    let result = CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pixelBuffer)
    guard result == kCVReturnSuccess, let pixelBuffer else {
      throw EncoderError.cannotCreatePixelBuffer
    }

    context.render(
      image,
      to: pixelBuffer,
      bounds: CGRect(x: 0, y: 0, width: width, height: height),
      colorSpace: colorSpace
    )
    let presentationTime = CMTime(value: Int64(index), timescale: fps)
    guard adaptor.append(pixelBuffer, withPresentationTime: presentationTime) else {
      throw writer.error ?? EncoderError.appendFailed(frameUrl.path)
    }
  }

  input.markAsFinished()
  let semaphore = DispatchSemaphore(value: 0)
  writer.finishWriting { semaphore.signal() }
  semaphore.wait()
  guard writer.status == .completed else {
    throw writer.error ?? EncoderError.cannotCreateWriter
  }
}

do {
  try run()
} catch {
  FileHandle.standardError.write(Data("\(error)\n".utf8))
  exit(1)
}
