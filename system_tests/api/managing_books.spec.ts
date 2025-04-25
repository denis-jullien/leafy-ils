import { test, expect } from '@playwright/test';

const LOCALHOST = "http://127.0.0.1:8000";
const URL = LOCALHOST;

const book_creation_keys = ["archived", "created_date","last_update_date","title","author",
    "abstract","publisher","catalog","category_type",
    "category_age","category_topics","cover","available","isbn",
    "format","publication_date","record_source","language"
];


// test.describe('Managing Books', () => {

[
    { data_expected: { title: "test1", author: "string" } },
    { data_expected: {
        archived: false,
        created_date: "2025-04-25",
        last_update_date: "2025-04-25",
        title: "test2",
        author: "string",
        abstract: "string",
        publisher: "string",
        catalog: "string",
        category_type: "string",
        category_age: "string",
        category_topics: "string",
        cover: "string",
        available: true,
        isbn: 1,
        format: "string",
        publication_date: "string",
        record_source: "string"
        }},
        // note: add language
].forEach(({ data_expected}) => {
    test(`Adding a New Book with ${data_expected.title}`, async ({ request }) => {
        // Add the book in the catalog
        const creation_result = await request.post(`${URL}/api/v1/books`, {
            data: data_expected
        })
        expect(creation_result.ok()).toBeTruthy();

        // Add default value to the optional keys if not given at the creation
        for (const key of book_creation_keys) {
            console.log(key)
            if (!(key in data_expected)) {
                if (key === "archived") {
                    data_expected["archived"] = false
                } else if (key === "available") {
                    data_expected["available"] = true
                } else {
                    data_expected[key] = null
                }
            }
        }
        // Check the response to the api
        let creation_result_json = await creation_result.json()
        expect(creation_result_json).toHaveProperty('id')
        const book_id = creation_result_json.id
        data_expected["id"] = book_id
        console.log(creation_result_json)
        console.log(data_expected)
        expect(creation_result_json).toEqual(data_expected);

        // Check that the book has been add to the catalog
        const catalog_id_result = await request.get(`${URL}/api/v1/books/${book_id}`)
        expect(catalog_id_result.ok()).toBeTruthy();
        const catalog_id_result_json = await catalog_id_result.json()
        expect(catalog_id_result_json).toEqual(data_expected);

});
});

// });
