/**
 * Gera um UUID v4 compatível
 * Usa crypto.randomUUID() se disponível, caso contrário usa uma implementação alternativa
 */
export function generateUUID(): string {
  // Tenta usar crypto.randomUUID() se disponível (suportado em navegadores modernos)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // Se falhar, continua para o fallback
    }
  }

  // Fallback: gera UUID v4 usando crypto.getRandomValues() (mais amplamente suportado)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Ajustar bytes conforme especificação UUID v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Versão 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variante

    // Converter para string hexadecimal
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

  // Fallback final: gera um ID único baseado em timestamp e número aleatório
  // Menos seguro, mas funciona em qualquer ambiente
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${randomPart2}`;
}

