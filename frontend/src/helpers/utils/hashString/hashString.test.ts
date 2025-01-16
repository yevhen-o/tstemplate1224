import { hashString } from "./hashString"; // Update the path based on your setup

describe("hashString", () => {
  it("should return a consistent hash for the same input", async () => {
    const input = "example";
    const expectedHash =
      "50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c";
    const result = await hashString(input);
    expect(result).toBe(expectedHash);
  });

  it("should return a different hash for a different input", async () => {
    const input1 = "example1";
    const input2 = "example2";
    const hash1 = await hashString(input1);
    const hash2 = await hashString(input2);
    expect(hash1).not.toBe(hash2);
  });

  it("should handle an empty string", async () => {
    const input = "";
    const expectedHash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // SHA-256 of an empty string
    const result = await hashString(input);
    expect(result).toBe(expectedHash);
  });

  it("should handle special characters", async () => {
    const input = "hello@world!#%&";
    const expectedHash =
      "50a44e335bc2bfc93fdf086966ab76c27eb8bd10199109d96a2e34c26471e95c";
    const result = await hashString(input);
    expect(result).toBe(expectedHash);
  });

  it("should handle long strings", async () => {
    const input = "a".repeat(1000);
    const expectedHash =
      "41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3"; // SHA-256 of 1000 'a's
    const result = await hashString(input);
    expect(result).toBe(expectedHash);
  });
});
