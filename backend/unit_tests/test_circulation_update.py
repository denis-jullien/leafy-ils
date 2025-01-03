import pytest
from fastapi.testclient import TestClient


def test_update_unknown_circulation(client: TestClient) -> None:
    new_data = {
        "firstname": "firstname",
        "surname": "surname",
        "family_referent": True,
        "birthdate": "2019-12-04",
        "family_id": 1,
    }

    response = client.patch("/api/v1/circulations/1", json=new_data)
    assert response.status_code == 404
    data_response = response.json()
    assert data_response["detail"] == "Circulation not found"


@pytest.mark.parametrize(
    "init_data",
    [
        {"borrowed_date": "2019-12-04", "book_id": 1, "member_id": 2},
        {
            "borrowed_date": "2019-12-04",
            "book_id": 1,
            "member_id": 1,
            "returned_date": "2019-12-20",
        },
    ],
)
@pytest.mark.parametrize(
    "new_data",
    [
        {"borrowed_date": "2020-12-04"},
        {"book_id": 2},
        {"member_id": 1},
        {"returned_date": "2024-12-20"},
        {
            "borrowed_date": "2022-12-04",
            "book_id": 1,
            "member_id": 1,
            "returned_date": "2030-12-20",
        },
        {},
    ],
)
def test_update_circulation(
    client: TestClient, init_data: dict, new_data: dict
) -> None:
    # add family
    family_data = {"email": "test_email", "phone_number": "phone_test"}
    response = client.post("/api/v1/families", json=family_data)
    assert response.status_code == 200
    # add members
    member_data = {"firstname": "firstname", "surname": "surname", "family_id": 1}
    response = client.post("/api/v1/members", json=member_data)
    assert response.status_code == 200
    response = client.post("/api/v1/members", json=member_data)
    assert response.status_code == 200
    # add book
    book_data = {"title": "title", "author": "author"}
    response = client.post("/api/v1/books", json=book_data)
    assert response.status_code == 200
    # add circulation
    response = client.post("/api/v1/circulations", json=init_data)
    assert response.status_code == 200
    data_response = response.json()

    response = client.patch(
        f"/api/v1/circulations/{data_response["id"]}", json=new_data
    )
    assert response.status_code == 200

    data_expected = init_data
    for key, value in new_data.items():
        data_expected[key] = value

    data_response = response.json()
    assert "id" in data_response
    for key, value in data_expected.items():
        assert data_response[key] == value
