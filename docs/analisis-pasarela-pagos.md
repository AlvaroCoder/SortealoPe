# Análisis Comparativo de Pasarelas de Pago para Sortealo
### Aplicación SaaS de Gestión de Rifas — Mercado Peruano
**Versión:** 1.0 | **Fecha:** Abril 2026 | **Elaborado por:** Equipo COSAI

---

## 1. Introducción

Sortealo es una plataforma SaaS B2C orientada a la gestión y monitoreo de rifas y sorteos en el mercado peruano. Su modelo de monetización se basa en la venta de **paquetes virtuales de tickets** que los administradores adquieren para operar sus eventos dentro de la plataforma.

La decisión sobre qué pasarela de pago utilizar es estratégica: afecta directamente la rentabilidad del negocio, la experiencia del usuario, la viabilidad legal ante las tiendas de aplicaciones (Google Play Store y Apple App Store) y el cumplimiento regulatorio en Perú.

Este documento analiza cinco alternativas: **Google Play Billing**, **Apple In-App Purchase (IAP)**, **Culqi**, **MercadoPago** y **Stripe**, evaluando sus dimensiones técnicas, económicas y legales, con énfasis en el contexto peruano y el lanzamiento simultáneo en ambas tiendas.

---

## 2. Contexto Regulatorio y de Políticas de Tiendas

### 2.1 Google Play Billing

Google exige el uso de su sistema de facturación nativo (Google Play Billing) para todas las aplicaciones que vendan **bienes o servicios digitales** consumidos dentro de la aplicación Android, conforme a su *Payments Policy* (Google, 2024a). Esta obligación aplica directamente a los paquetes virtuales de tickets de Sortealo.

Adicionalmente, la *Gambling Policy* de Google Play (Google, 2024b) establece que las aplicaciones de juegos de azar, loterías y sorteos requieren una **licencia gubernamental** del país de operación y deben ser aprobadas de forma explícita por Google. En Perú, el ente regulador es el **Ministerio de Cultura** para loterías benéficas y el **MINCETUR** para juegos de azar regulados (MINCETUR, 2023). Sin dichas licencias, la app puede ser rechazada o removida de la tienda.

### 2.2 Apple In-App Purchase (IAP)

Apple impone reglas similares mediante sus *App Store Review Guidelines*, específicamente la sección 3.1.1 (Apple, 2024a), que obliga a usar IAP para la venta de contenido digital dentro de aplicaciones iOS. La sección 3.1.3 regula los juegos de azar: requiere geolocalización para restringir el acceso a jurisdicciones autorizadas y licencias gubernamentales vigentes (Apple, 2024b).

Desde el fallo judicial *Epic v. Apple* (2021) y las posteriores actualizaciones de 2024, Apple permite en ciertos mercados incluir un enlace externo para que los usuarios compren fuera de la app (Apple, 2024c). Sin embargo, esta opción aún no está disponible en todos los mercados, y el proceso de aprobación para el enlace externo es burocrático.

### 2.3 Implicancia para Sortealo

El punto crítico es la clasificación de la app. Si Google o Apple la catalogan como **app de juegos de azar**, se activan requerimientos de licencia que en Perú son complejos y costosos de obtener. La estrategia más segura, adoptada por plataformas similares como Eventbrite o Ticket Tailor, es **posicionar la app como herramienta de gestión de eventos**, donde la compra de paquetes ocurre exclusivamente en la web (fuera del ecosistema de las tiendas), eliminando la obligación de usar IAP/Billing y reduciendo el riesgo de clasificación como app de apuestas.

---

## 3. Análisis de Alternativas

### 3.1 Google Play Billing

| Dimensión | Detalle |
|---|---|
| **Tipo** | Sistema nativo de facturación de Google |
| **Obligatoriedad** | Obligatorio para bienes digitales en Android (Google Play) |
| **Comisión** | 15% sobre los primeros USD 1,000,000 anuales; 30% a partir de ese umbral |
| **Métodos de pago** | Tarjetas Visa/MC, Google Pay, saldo de Play Store |
| **Moneda** | USD (conversión interna) |
| **Disponibilidad** | Solo Android (Google Play) |
| **Integración** | SDK nativo para Android / React Native (`react-native-iap`) |

**Ventajas:**
- Experiencia de compra fluida dentro de la app, sin salir a un navegador.
- El usuario ya tiene sus datos de pago guardados en Google.
- Gestión automática de reembolsos y disputas.
- Menor fricción en el checkout (1-2 taps).

**Desventajas:**
- Comisión de 15-30%: en un paquete de S/100, se pierde entre S/15 y S/30 por transacción.
- Obliga a que toda la lógica de paquetes pase por Google, perdiendo control del pricing.
- Si Google clasifica la app como gambling, se activa la *Gambling Policy* y la app puede ser removida sin previo aviso.
- No disponible para iOS: necesitarías Apple IAP en paralelo, duplicando la implementación.
- Cambios de política de Google pueden afectar la app retroactivamente.

**Veredicto:** Solo conviene si la app es 100% gratuita en iOS y el flujo de compra está perfectamente aislado del contexto de rifas. Para el modelo actual de Sortealo, el riesgo regulatorio y la comisión lo hacen poco atractivo.

---

### 3.2 Apple In-App Purchase (IAP)

| Dimensión | Detalle |
|---|---|
| **Tipo** | Sistema nativo de facturación de Apple |
| **Obligatoriedad** | Obligatorio para bienes digitales en iOS (App Store) |
| **Comisión** | 15% para desarrolladores con ingresos < USD 1M/año; 30% en adelante |
| **Métodos de pago** | Tarjetas, Apple Pay, saldo de App Store |
| **Moneda** | USD (Apple gestiona la conversión) |
| **Disponibilidad** | Solo iOS |
| **Integración** | StoreKit (nativo) / `react-native-iap` |

**Ventajas:**
- Experiencia nativa en iOS, máxima confianza del usuario Apple.
- Apple gestiona impuestos en muchos países.
- Touch ID / Face ID para autorizar pagos en segundos.

**Desventajas:**
- Las mismas restricciones de gambling que Google: requiere licencias gubernamentales para rifas/sorteos.
- Comisión idéntica (15-30%), misma pérdida de márgenes.
- Apple puede rechazar la app en cualquier actualización si detecta contenido de sorteos sin licencia.
- No aplica a Android: necesitarías Google Play Billing en paralelo.
- Proceso de revisión de Apple es lento (1-7 días por actualización), lo que ralentiza el desarrollo.

**Veredicto:** Mismo análisis que Google Play Billing. Combinados, ambos sistemas impondrían una doble implementación compleja con comisiones altas y riesgo legal latente.

---

### 3.3 Culqi ⭐ Recomendado Principal

| Dimensión | Detalle |
|---|---|
| **Tipo** | Pasarela de pago peruana, regulada por la SBS |
| **Obligatoriedad** | Ninguna (integración voluntaria vía API) |
| **Comisión** | ~3.49% + S/1.00 por transacción exitosa |
| **Métodos de pago** | Visa, Mastercard, Amex (tarjetas peruanas e internacionales) |
| **Moneda** | Soles (S/) |
| **Disponibilidad** | Web, iOS, Android (sin restricciones de tiendas) |
| **Integración** | API REST + SDK JavaScript para web; integración backend directa |

**Ventajas:**
- Empresa regulada por la **Superintendencia de Banca, Seguros y AFP (SBS)** del Perú, lo que da confianza legal y operativa.
- Cobra directamente en **soles peruanos**: sin exposición a riesgo cambiario.
- Comisión drásticamente menor vs IAP/Billing: en S/100 se paga ~S/4.49, no S/15-30.
- La compra ocurre en la **web de Sortealo**, no dentro de la app: no activa las políticas de IAP/Billing.
- Retiro de fondos en 1-2 días hábiles a cuenta bancaria peruana.
- Tiene sandbox para pruebas sin costo.
- Compatible con el backend Spring Boot vía la librería oficial de Java.
- Cumple con el estándar **PCI DSS** para manejo seguro de datos de tarjetas.

**Desventajas:**
- No acepta Yape ni Plin directamente (solo tarjetas).
- Menor reconocimiento de marca fuera del Perú.
- Si Sortealo escala a otros países de LATAM, necesitaría agregar otro procesador.

**Veredicto:** La mejor opción para el mercado peruano considerando márgenes, soberania sobre el proceso de pago y cumplimiento legal.

---

### 3.4 MercadoPago

| Dimensión | Detalle |
|---|---|
| **Tipo** | Plataforma de pagos de Mercado Libre |
| **Obligatoriedad** | Ninguna |
| **Comisión** | ~3.99% por pago con tarjeta; varía según método |
| **Métodos de pago** | Tarjetas, Yape, transferencias, saldo MP |
| **Moneda** | Soles (S/) |
| **Disponibilidad** | Web, iOS, Android |
| **Integración** | SDK oficial, Checkout Pro (hosted), API directa |

**Ventajas:**
- Acepta **Yape** como método de pago, muy popular en Perú.
- SDK React Native disponible, bien documentado.
- Checkout Pro permite integración rápida con una sola URL.
- Reconocimiento de marca: muchos usuarios peruanos ya tienen cuenta.

**Desventajas:**
- Comisión ligeramente mayor que Culqi.
- **Tiempo de retiro de fondos puede llegar a 14 días** (un problema real de flujo de caja).
- Soporte al cliente peruano limitado; problemas se resuelven vía Argentina.
- Historial de congelamiento de cuentas sin previo aviso en algunos casos reportados.
- La plataforma es compleja: muchas configuraciones y estados de pago que manejar.

**Veredicto:** Válido como alternativa o complemento para aceptar Yape. No recomendado como procesador principal por los tiempos de retiro y el soporte deficiente.

---

### 3.5 Stripe

| Dimensión | Detalle |
|---|---|
| **Tipo** | Plataforma global de pagos |
| **Obligatoriedad** | Ninguna |
| **Comisión** | 2.9% + USD 0.30 por transacción |
| **Métodos de pago** | Tarjetas internacionales, Apple Pay, Google Pay, Link |
| **Moneda** | USD (conversión con fee adicional ~1.5%) |
| **Disponibilidad** | Web, iOS, Android |
| **Integración** | Excelente: SDK React Native (`@stripe/stripe-react-native`), documentación superior |

**Ventajas:**
- Mejor experiencia de desarrollo del mercado: documentación exhaustiva, webhooks robustos, dashboard potente.
- Comisión base competitiva (2.9%).
- Soporta suscripciones recurrentes de forma nativa (Stripe Billing).
- Herramientas avanzadas: Radar (antifraude con ML), Stripe Identity, Invoices.

**Desventajas:**
- **Los fondos se liquidan en USD**: necesitas cuenta bancaria en dólares o usar un intermediario (Payoneer, Wise). Esto agrega fricción operativa y costo de conversión (~1.5-2% adicional).
- Comisión real en Perú: 2.9% + $0.30 + ~1.5% conversión ≈ **5-6% efectivo** en muchos casos, superando a Culqi.
- Sin soporte local en Perú; todo el soporte es en inglés vía chat.
- Las tarjetas emitidas por bancos peruanos a veces tienen tasas de rechazo más altas en Stripe vs Culqi.

**Veredicto:** Excelente para productos globales o si ya tienes infraestructura en USD. No es la primera opción para un negocio enfocado en el mercado peruano.

---

## 4. Cuadro Comparativo Consolidado

| Criterio | Google Play Billing | Apple IAP | Culqi | MercadoPago | Stripe |
|---|---|---|---|---|---|
| **Comisión efectiva** | 15–30% | 15–30% | ~3.5% | ~4.0% | ~5–6%* |
| **Moneda de liquidación** | USD | USD | S/ | S/ | USD |
| **Acepta Yape/Plin** | No | No | No | Sí | No |
| **Obligatorio en tiendas** | Sí (Android) | Sí (iOS) | No | No | No |
| **Riesgo clasificación gambling** | Alto | Alto | Ninguno | Ninguno | Ninguno |
| **Tiempo retiro fondos** | 15–30 días | 30–45 días | 1–2 días | Hasta 14 días | 2–3 días (USD) |
| **Regulación peruana (SBS)** | No | No | Sí | No | No |
| **Calidad de documentación** | Media | Media | Buena | Buena | Excelente |
| **Soporte en Perú** | No | No | Sí | Regular | No |
| **Complejidad de integración** | Alta | Alta | Media | Media | Baja |
| **Riesgo de suspensión de app** | Alto | Alto | Ninguno | Ninguno | Ninguno |

*Incluye conversión de moneda

---

## 5. Análisis de Márgenes

Tomando como ejemplo un paquete de **S/100**:

| Pasarela | Costo por transacción | Ingreso neto |
|---|---|---|
| Google Play Billing | S/15.00 – S/30.00 | S/70 – S/85 |
| Apple IAP | S/15.00 – S/30.00 | S/70 – S/85 |
| Culqi | ~S/4.49 | **~S/95.51** |
| MercadoPago | ~S/4.99 | ~S/95.01 |
| Stripe | ~S/5.50 – S/6.00 | ~S/94.00 |

A **100 transacciones de S/100 al mes**:

| Pasarela | Ingresos mensuales netos |
|---|---|
| Google/Apple IAP | S/7,000 – S/8,500 |
| Culqi | **S/9,551** |
| MercadoPago | S/9,501 |
| Stripe | S/9,400 |

La diferencia entre IAP y Culqi es de **hasta S/2,551 mensuales** en este escenario. A escala, este diferencial se vuelve crítico para la rentabilidad del negocio.

---

## 6. Estrategia Recomendada para Sortealo

### 6.1 Arquitectura de Pagos

Se recomienda implementar una **estrategia híbrida** con dos capas:

**Capa 1 — Procesador principal: Culqi**
- Maneja la compra de paquetes virtuales desde la web de Sortealo.
- El usuario no realiza ninguna transacción dentro de la app móvil.
- Evita completamente las políticas de IAP/Billing de las tiendas.

**Capa 2 — Complemento: MercadoPago (solo para Yape)**
- Opcionalmente, para usuarios que prefieren pagar con Yape.
- Limitado al checkout web, nunca dentro de la app.

### 6.2 Flujo de Compra Recomendado

```
1. Usuario (admin) ve en la app que necesita más tickets
2. La app muestra un botón "Adquirir paquetes" → abre navegador externo
3. Landing web de Sortealo → selección de paquete → checkout con Culqi
4. Culqi procesa el pago → webhook notifica al backend de Sortealo
5. Backend activa el paquete en la cuenta del usuario
6. App móvil detecta el nuevo saldo de tickets al próximo refresco
```

### 6.3 Beneficios de esta Estrategia

1. **Sin comisiones de Apple/Google**: márgenes de ~96% vs ~70-85%.
2. **Sin riesgo de clasificación gambling**: la app es una herramienta de gestión, no vende nada.
3. **Sin dependencia de políticas de tiendas**: cambios en políticas de Google/Apple no afectan el modelo de negocio.
4. **Cobros en soles**: simplicidad contable y tributaria en Perú.
5. **Cumplimiento con la SBS**: Culqi está regulado y auditado en Perú.

---

## 7. Consideraciones Legales en Perú

Las rifas y sorteos en Perú están reguladas por la **Ley N° 28152** (Ley que regula los sorteos, rifas y actividades de beneficencia) y el **Decreto Supremo N° 007-2007-MINCETUR** para juegos de casino y similares (MINCETUR, 2007).

Para operar como plataforma de gestión (no como organizador de rifas), Sortealo se posiciona como un **proveedor de software SaaS**, similar a herramientas como Shopify o Eventbrite. En este contexto:

- La responsabilidad legal de obtener permisos para cada rifa recae en el **organizador del evento** (el cliente de Sortealo), no en Sortealo como plataforma.
- Sortealo solo provee la herramienta tecnológica, similar a cómo WhatsApp no es responsable del contenido enviado por sus usuarios.
- Este posicionamiento debe estar claramente establecido en los **Términos y Condiciones** de la plataforma.

Se recomienda consultar con un abogado especializado en derecho digital peruano antes del lanzamiento.

---

## 8. Conclusiones

1. **Google Play Billing y Apple IAP deben evitarse** como procesadores principales para Sortealo. Sus comisiones de 15-30%, el riesgo de clasificación como app de gambling y la pérdida de control sobre el proceso de compra los hacen económicamente inviables y legalmente riesgosos.

2. **Culqi es la opción óptima** para el mercado peruano: regulada por la SBS, comisiones competitivas (~3.5%), liquidación en soles y soporte local.

3. **La compra debe ocurrir exclusivamente en la web** de Sortealo, fuera del ecosistema de las tiendas, siguiendo el modelo de Spotify, Netflix y Canva en sus versiones móviles.

4. **MercadoPago puede complementar** como método de pago adicional para aceptar Yape, dado el alto uso de esta billetera digital en Perú (más de 12 millones de usuarios activos a 2024).

5. **Stripe es viable a futuro** si Sortealo expande operaciones a otros países de LATAM o USA y necesita una solución global, pero no es la primera prioridad para el mercado peruano.

---

## Bibliografía

- Apple Inc. (2024a). *App Store Review Guidelines, Section 3.1.1: In-App Purchase*. Recuperado de https://developer.apple.com/app-store/review/guidelines/#in-app-purchase

- Apple Inc. (2024b). *App Store Review Guidelines, Section 3.1.3: Gambling, Games, and Lotteries*. Recuperado de https://developer.apple.com/app-store/review/guidelines/#gambling

- Apple Inc. (2024c). *Distributing apps in the European Union*. Recuperado de https://developer.apple.com/support/alternative-browser-engines/

- Culqi. (2024). *Documentación oficial de la API de Culqi*. Recuperado de https://apidocs.culqi.com/

- Google LLC. (2024a). *Google Play Billing — Payments Policy*. Recuperado de https://support.google.com/googleplay/android-developer/answer/9858738

- Google LLC. (2024b). *Google Play Developer Policy Center — Real Money Gambling, Games, and Contests*. Recuperado de https://support.google.com/googleplay/android-developer/answer/9877032

- MercadoPago. (2024). *Documentación para desarrolladores — MercadoPago Perú*. Recuperado de https://www.mercadopago.com.pe/developers

- MINCETUR. (2007). *Decreto Supremo N° 007-2007-MINCETUR — Reglamento de Juegos de Casino*. Diario Oficial El Peruano.

- MINCETUR. (2023). *Requisitos para operadores de juegos de azar en Perú*. Ministerio de Comercio Exterior y Turismo del Perú. Recuperado de https://www.mincetur.gob.pe

- Stripe Inc. (2024). *Stripe Documentation — React Native SDK*. Recuperado de https://stripe.com/docs/stripe-react-native

- Superintendencia de Banca, Seguros y AFP (SBS). (2024). *Registro de empresas supervisadas — Sistemas de pago*. Recuperado de https://www.sbs.gob.pe

- United States District Court, Northern District of California. (2021). *Epic Games, Inc. v. Apple Inc.*, Case No. 4:20-cv-05640-YGR.

- YPFB (Yape). (2024). *Estadísticas de usuarios activos 2024*. BCP Digital. Lima, Perú.

---

*Documento elaborado por el equipo de desarrollo de COSAI para uso interno de Sortealo. Versión 1.0 — Abril 2026.*
