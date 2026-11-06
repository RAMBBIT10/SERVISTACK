import { ConfiguracionService } from './configuracion.service';
import { aFechaLocal } from './fechas-utc';

describe('aFechaLocal', () => {
  const configuracionFalsa = {
    config: { localeFechas: 'es-CO' },
  } as unknown as ConfiguracionService;

  it('convierte una fecha en UTC a texto con el formato configurado', () => {
    const texto = aFechaLocal('2026-11-05T15:30:00Z', configuracionFalsa);
    expect(texto).toBe(new Date('2026-11-05T15:30:00Z').toLocaleString('es-CO'));
  });

  it('usa el idioma que viene de la configuracion', () => {
    const otraConfiguracion = { config: { localeFechas: 'en-US' } } as unknown as ConfiguracionService;
    const texto = aFechaLocal('2026-11-05T15:30:00Z', otraConfiguracion);
    expect(texto).toBe(new Date('2026-11-05T15:30:00Z').toLocaleString('en-US'));
  });
});
