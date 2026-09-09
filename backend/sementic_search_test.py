import json
import chromadb


client = chromadb.PersistentClient("./chroma_db")

collection = client.get_or_create_collection(
    name="products_collection"
)

if collection.count != 0:

    with open("./JSON_DATA/products.json", "r") as file:
        data = json.load(file)

    collection.add(
        ids=[str(product["id"]) for product in data],
        documents=[
            f"name:{product["name"]}-description:{product["description"]}-category:{product["category"]}" for product in data],
        metadatas=[
            {
                "name": product["name"],
                "category": product["category"]
            }
            for product in data
        ]
    )

for query in [
    "power bank",
    "laptop",
    "headphones",
    "smart watch"
]:
    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    print("\nQUERY:", query)
    print(results["ids"][0])
    print(results["distances"][0])
