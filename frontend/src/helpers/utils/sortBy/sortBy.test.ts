import sortBy, { SortTypes } from "./sortBy";

describe("sortBy function", () => {
  const data = [
    { id: 1, name: "Alice", age: 25, createdAt: "2023-01-01" },
    { id: 2, name: "Bob", age: 30, createdAt: "2023-02-01" },
    { id: 3, name: "Charlie", age: 20, createdAt: "2023-03-01" },
    { id: 4, name: "Alice", age: 35, createdAt: "2023-01-15" },
  ];

  it("should return an empty array for empty input", () => {
    expect(sortBy([], "age", true)).toEqual([]);
  });

  it("should sort by an integer field in ascending order", () => {
    const sorted = sortBy(data, "age", true, SortTypes.int);
    expect(sorted.map((item) => item.age)).toEqual([20, 25, 30, 35]);
  });

  it("should sort by an integer field in descending order", () => {
    const sorted = sortBy(data, "age", false, SortTypes.int);
    expect(sorted.map((item) => item.age)).toEqual([35, 30, 25, 20]);
  });

  it("should sort by a string field in ascending order", () => {
    const sorted = sortBy(data, "name", true, SortTypes.string);
    expect(sorted.map((item) => item.name)).toEqual([
      "Alice",
      "Alice",
      "Bob",
      "Charlie",
    ]);
  });

  it("should sort by a string field in descending order", () => {
    const sorted = sortBy(data, "name", false, SortTypes.string);
    expect(sorted.map((item) => item.name)).toEqual([
      "Charlie",
      "Bob",
      "Alice",
      "Alice",
    ]);
  });

  it("should sort by a date field in ascending order", () => {
    const sorted = sortBy(data, "createdAt", true, SortTypes.date);
    expect(sorted.map((item) => item.createdAt)).toEqual([
      "2023-01-01",
      "2023-01-15",
      "2023-02-01",
      "2023-03-01",
    ]);
  });

  it("should sort by a date field in descending order", () => {
    const sorted = sortBy(data, "createdAt", false, SortTypes.date);
    expect(sorted.map((item) => item.createdAt)).toEqual([
      "2023-03-01",
      "2023-02-01",
      "2023-01-15",
      "2023-01-01",
    ]);
  });

  it("should use secondary sort field when primary fields are equal", () => {
    const sorted = sortBy(data, "name", true, SortTypes.string, "age", true);
    expect(sorted.map((item) => `${item.name}-${item.age}`)).toEqual([
      "Alice-25",
      "Alice-35",
      "Bob-30",
      "Charlie-20",
    ]);
  });

  it("should handle missing fields gracefully", () => {
    const incompleteData = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob" },
      { id: 3, age: 20 },
    ];
    const sorted = sortBy(incompleteData, "age", true, SortTypes.int);
    expect(sorted.map((item) => item.age ?? null)).toEqual([null, 20, 25]);
  });

  it("should not modify the original array", () => {
    const originalData = [...data];
    sortBy(data, "age", true, SortTypes.int);
    expect(data).toEqual(originalData);
  });

  it("should handle custom object paths", () => {
    const nestedData = [
      { id: 1, details: { score: 85 } },
      { id: 2, details: { score: 90 } },
      { id: 3, details: { score: 80 } },
    ];
    const sorted = sortBy(nestedData, "details.score", true, SortTypes.int);
    expect(sorted.map((item) => item.details.score)).toEqual([80, 85, 90]);
  });

  it("should handle non-existent secondary fields gracefully", () => {
    const sorted = sortBy(
      data,
      "name",
      true,
      SortTypes.string,
      "nonExistentField",
      false
    );
    expect(sorted.map((item) => item.name)).toEqual([
      "Alice",
      "Alice",
      "Bob",
      "Charlie",
    ]);
  });
});
