async function fetchData(file) {
  try {
    const response = await fetch(`data/${file}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${file}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}