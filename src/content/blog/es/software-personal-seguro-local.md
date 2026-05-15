---
title: "El software personal no siempre necesita vivir en la nube"
description: "El caso de miles de apps creadas con vibe coding y datos sensibles expuestos muestra por qué Forger pone la seguridad y el uso local en el centro."
pubDate: 2026-05-12
lang: es
---

Un artículo reciente de [Xataka](https://www.xataka.com/seguridad/vibe-coding-prometia-democratizar-software-su-primer-regalo-5-000-apps-datos-sensibles-abierto) resume un problema que vamos a ver cada vez más: herramientas creadas rápido, por personas que sí entienden su necesidad, pero que no necesariamente conocen las preguntas de seguridad que una aplicación debe responder antes de quedar expuesta en Internet.

La investigación citada por Xataka encontró más de 5.000 aplicaciones creadas con herramientas de vibe coding que prácticamente no tenían autenticación. Cerca de 2.000 parecían contener datos privados. No hablamos de una vulnerabilidad sofisticada, sino de algo más básico y más peligroso: apps útiles, construidas para resolver un problema concreto, publicadas en la nube sin los controles adecuados.

Ese punto importa mucho para Forger.

## Democratizar software no puede significar publicar todo

Nos gusta la idea de que más personas puedan crear herramientas propias. Una app para ordenar gastos, revisar recetas, gestionar documentos, preparar reportes internos o analizar información personal no debería requerir un equipo completo de ingeniería.

Pero crear software y publicar software no son lo mismo.

Muchas herramientas personales no necesitan una URL pública. No necesitan estar disponibles para todo Internet. No necesitan una base de datos remota, un panel de administración compartido ni una configuración de permisos escondida detrás de tres menús. Necesitan funcionar bien para una persona, con sus datos, en su computador.

Cuando una app personal se sube a la nube por defecto, la superficie de riesgo crece antes de que el usuario entienda que existe una superficie de riesgo. Eso es especialmente grave cuando la app contiene finanzas, notas privadas, archivos de trabajo, datos de clientes, información familiar o cualquier otro material que la persona nunca pensó publicar.

## El enfoque de Forger es local primero

Forger parte desde una premisa distinta: hay muchas apps que deberían vivir en un espacio privado del usuario, no en un servidor público.

En Forger, las apps se instalan y corren localmente. Cada app vive en el workspace privado de la persona. Sus datos pertenecen a esa instalación. El agente puede ayudar a explicar, cargar información, revisar contenido o adaptar la app, pero lo hace operando sobre una herramienta local, no sobre una demo genérica publicada en Internet.

Eso no elimina todas las responsabilidades de seguridad. Ningún stack lo hace. Pero cambia el punto de partida:

- una app personal no queda expuesta públicamente solo por existir;
- los datos no tienen que salir a una base remota para que la app sea útil;
- las capacidades de la app pueden declararse y revisarse de forma explícita;
- las automatizaciones y cambios se pueden tratar como operaciones dentro del entorno privado del usuario.

Para nosotros, esa diferencia es central.

## Hay una categoría completa de apps que puede ser local

La nube tiene sentido para muchas cosas: colaboración en tiempo real, distribución global, sincronización entre equipos, servicios públicos y productos que necesitan disponibilidad remota.

Pero una parte grande del software que la gente está empezando a crear con IA no cae en esa categoría. Son herramientas personales, pequeñas bases de datos, paneles de revisión, asistentes de organización, flujos de análisis y apps de trabajo individual.

Esas apps pueden beneficiarse de la IA sin quedar publicadas en la nube. Pueden ser modificables, explicables y útiles sin convertir cada experimento personal en un endpoint público.

Ese es el espacio que queremos cuidar con Forger: apps reales, instaladas localmente, adaptables por un agente y diseñadas desde el principio para tratar la privacidad como parte de la experiencia, no como una opción avanzada.

La promesa de crear software con lenguaje natural sigue siendo poderosa. Pero si el resultado contiene datos personales, la pregunta correcta no es solo "¿funciona?". También es "¿dónde vive?", "¿quién puede verlo?" y "¿por qué tendría que estar en Internet?".
