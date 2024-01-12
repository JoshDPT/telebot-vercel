function getOffsetFromPage(pageNumber: number): number {
  const limit = 10;
  const offset = (pageNumber - 1) * limit;
  return offset >= 0 ? offset : 0; // Ensure offset is non-negative
}

export { getOffsetFromPage };
