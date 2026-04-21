const PRODUCTS_API_URL = "https://69e758d268208c1debe8b731.mockapi.io/api/v1/Products";

const getDataPhone = async () => {
    try {
        const response = await axios.get(PRODUCTS_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}
