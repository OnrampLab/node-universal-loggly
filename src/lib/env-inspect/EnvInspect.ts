export class EnvInspect {
  /**
   * is web environment
   *
   * @returns {boolean}
   */
  static isWeb() {
    if (typeof window === 'undefined') {
      return false;
    }
    if (typeof document === 'undefined') {
      return false;
    }

    return true;
  }

  // ============================================================
  //  private
  // ============================================================
}
