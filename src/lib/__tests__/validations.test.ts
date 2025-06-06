import { cameraUpdateSchema, demographicsConfigSchema } from "../validations";

describe("Validation Schemas", () => {
  describe("cameraUpdateSchema", () => {
    it("validates valid camera data", () => {
      const validData = {
        name: "Test Camera",
        rtsp_url: "https://example.com/stream",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_fps: 30,
      };

      const result = cameraUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("requires name", () => {
      const invalidData = {
        rtsp_url: "https://example.com/stream",
      };

      const result = cameraUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("validates rtsp_url is a valid URL", () => {
      const invalidData = {
        name: "Test Camera",
        rtsp_url: "not-a-url",
      };

      const result = cameraUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("rtsp_url");
      }
    });

    it("validates frame dimensions within range", () => {
      const invalidData = {
        name: "Test Camera",
        rtsp_url: "https://example.com/stream",
        stream_frame_width: 3000,
      };

      const result = cameraUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("demographicsConfigSchema", () => {
    it("validates valid config data", () => {
      const validData = {
        camera_id: "123",
        track_history_max_length: 50,
        detection_confidence_threshold: 0.8,
        save_interval: 600,
      };

      const result = demographicsConfigSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("requires camera_id", () => {
      const invalidData = {
        track_history_max_length: 50,
      };

      const result = demographicsConfigSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("validates confidence threshold range", () => {
      const invalidData = {
        camera_id: "123",
        detection_confidence_threshold: 1.5,
      };

      const result = demographicsConfigSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
