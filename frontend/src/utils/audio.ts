// ORBiALOG Scientific Interface Audio Feedback
// Completely Muted / Disabled per user preference

class ScientificAudioEngine {
  public setEnabled(_val: boolean) {
    // Disabled
  }

  public isEnabled(): boolean {
    return false;
  }

  public playClick(_freq = 1200, _duration = 0.02) {
    // Muted
  }

  public playConfirm() {
    // Muted
  }

  public playScan() {
    // Muted
  }

  public playAlert() {
    // Muted
  }

  public playSelect() {
    // Muted
  }
}

export const audio = new ScientificAudioEngine();
