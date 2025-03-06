import {getRandomArrayElement} from '../utils.js';
const mockPoint = [
    {
      "id": "5e2e4235-51db-4f1e-b56a-e07128e80ea9",
      "base_price": 8367,
      "date_from": "2025-04-21T20:18:12.601Z",
      "date_to": "2025-04-22T19:49:12.601Z",
      "destination": "59987bad-1f4c-4a5c-bbbd-6191552fbe23",
      "is_favorite": true,
      "offers": [
        "0505e081-fc8f-4796-8e7b-6cb0807fa0b6",
        "01d82bc2-694d-42d5-b932-04ef4a0d8cad"
      ],
      "type": "drive"
    },
    {
      "id": "f075c495-e03f-4511-ab10-b31df148ce0f",
      "base_price": 5953,
      "date_from": "2025-04-23T13:48:12.601Z",
      "date_to": "2025-04-24T23:12:12.601Z",
      "destination": "fc2236be-ca8a-4a6c-a354-531d81545b08",
      "is_favorite": true,
      "offers": [],
      "type": "drive"
    },
    {
      "id": "b61a7342-7045-4026-8fa2-e2b01449b9d4",
      "base_price": 5316,
      "date_from": "2025-04-26T04:34:12.601Z",
      "date_to": "2025-04-27T14:37:12.601Z",
      "destination": "71db3a41-cf69-47e9-be48-2c080d0db40f",
      "is_favorite": true,
      "offers": [],
      "type": "check-in"
    },
    {
      "id": "655b8e29-55ce-4f5e-b49b-30f0c7f725a7",
      "base_price": 585,
      "date_from": "2025-04-27T21:06:12.601Z",
      "date_to": "2025-04-29T14:38:12.601Z",
      "destination": "71db3a41-cf69-47e9-be48-2c080d0db40f",
      "is_favorite": false,
      "offers": [
        "237b4955-0b7d-4376-ab8d-027f961147c4",
        "33d5e44f-003c-4bbc-a277-1870a1b9a63c",
        "fe5d43fe-943c-486d-8a96-922977b36d0f",
        "f007fc65-d325-4f96-a206-6ebfcb4ee11d"
      ],
      "type": "taxi"
    },
    {
      "id": "a122475d-3d1a-4abc-9ca6-107ee74d5485",
      "base_price": 9919,
      "date_from": "2025-04-30T03:23:12.601Z",
      "date_to": "2025-05-01T08:03:12.601Z",
      "destination": "fc2236be-ca8a-4a6c-a354-531d81545b08",
      "is_favorite": true,
      "offers": [
        "5c39d774-1a81-4a50-99fd-261b977f675b",
        "a7d13c12-44f9-497a-b70b-0f88bef1400a"
      ],
      "type": "train"
    },
    {
      "id": "00fb9bf3-68bf-4a9c-93a4-9820ebcc9466",
      "base_price": 6496,
      "date_from": "2025-05-01T17:00:12.601Z",
      "date_to": "2025-05-03T11:04:12.601Z",
      "destination": "b7fb13be-e8a2-4283-9f32-b44618094e63",
      "is_favorite": false,
      "offers": [],
      "type": "restaurant"
    },
    {
      "id": "11294866-1871-407e-baa6-99ddca1a836c",
      "base_price": 7585,
      "date_from": "2025-05-04T06:55:12.601Z",
      "date_to": "2025-05-04T14:38:12.601Z",
      "destination": "59987bad-1f4c-4a5c-bbbd-6191552fbe23",
      "is_favorite": false,
      "offers": [
        "fd50e095-0233-4a01-94a3-81797c56aa86",
        "ffeb6d5c-409d-436a-9ddf-2cfd44efdc92"
      ],
      "type": "restaurant"
    },
    {
      "id": "d03ad317-f5dc-4be5-92d5-07ef222c03b4",
      "base_price": 3398,
      "date_from": "2025-05-06T10:48:12.601Z",
      "date_to": "2025-05-07T16:30:12.601Z",
      "destination": "71db3a41-cf69-47e9-be48-2c080d0db40f",
      "is_favorite": false,
      "offers": [],
      "type": "flight"
    },
    {
      "id": "3cb80d27-01ef-45ac-b254-281ceceea224",
      "base_price": 1177,
      "date_from": "2025-05-08T05:16:12.601Z",
      "date_to": "2025-05-10T02:27:12.601Z",
      "destination": "71db3a41-cf69-47e9-be48-2c080d0db40f",
      "is_favorite": true,
      "offers": [],
      "type": "check-in"
    },
    {
      "id": "c6188528-b7b4-4a27-97fa-93a99135e6d2",
      "base_price": 5108,
      "date_from": "2025-05-11T13:56:12.601Z",
      "date_to": "2025-05-12T21:46:12.601Z",
      "destination": "f06f56f0-fc8e-4632-bb03-a09e290de443",
      "is_favorite": false,
      "offers": [
        "ee13004d-9874-4051-a913-a7574db76405",
        "d3f26da0-fbab-4ccd-b9cf-d159e352dfad"
      ],
      "type": "bus"
    },
    {
      "id": "12c9e5d5-c5d0-40d6-b074-27dfbbdb7789",
      "base_price": 954,
      "date_from": "2025-05-14T12:11:12.601Z",
      "date_to": "2025-05-16T03:12:12.601Z",
      "destination": "fc2236be-ca8a-4a6c-a354-531d81545b08",
      "is_favorite": true,
      "offers": [
        "d3f26da0-fbab-4ccd-b9cf-d159e352dfad"
      ],
      "type": "bus"
    },
    {
      "id": "c5366fd0-d2ed-44a0-afc6-573b7dc5b529",
      "base_price": 2445,
      "date_from": "2025-05-17T04:47:12.601Z",
      "date_to": "2025-05-19T04:50:12.601Z",
      "destination": "c2a294fa-3f37-4f10-9d63-3489742e1ac4",
      "is_favorite": false,
      "offers": [
        "1a4dca23-96ea-47bc-bc7f-6f4748f0b888"
      ],
      "type": "flight"
    },
    {
      "id": "8c6e38dd-4013-4f3f-b375-fbaff67066d5",
      "base_price": 4537,
      "date_from": "2025-05-19T15:39:12.601Z",
      "date_to": "2025-05-20T02:26:12.601Z",
      "destination": "fc2236be-ca8a-4a6c-a354-531d81545b08",
      "is_favorite": true,
      "offers": [],
      "type": "sightseeing"
    },
    {
      "id": "84c3c523-19d2-4653-9c63-6da148e1accb",
      "base_price": 8738,
      "date_from": "2025-05-20T23:49:12.601Z",
      "date_to": "2025-05-22T07:58:12.601Z",
      "destination": "fc2236be-ca8a-4a6c-a354-531d81545b08",
      "is_favorite": true,
      "offers": [
        "1a4dca23-96ea-47bc-bc7f-6f4748f0b888"
      ],
      "type": "flight"
    },
    {
      "id": "0c4d04a2-5553-45db-becb-f2a7283ea3fc",
      "base_price": 4855,
      "date_from": "2025-05-23T18:26:12.601Z",
      "date_to": "2025-05-25T03:09:12.601Z",
      "destination": "59987bad-1f4c-4a5c-bbbd-6191552fbe23",
      "is_favorite": false,
      "offers": [
        "0505e081-fc8f-4796-8e7b-6cb0807fa0b6",
        "01d82bc2-694d-42d5-b932-04ef4a0d8cad"
      ],
      "type": "drive"
    },
    {
      "id": "17524938-32f6-4646-b9ec-c5ce5fee366b",
      "base_price": 5508,
      "date_from": "2025-05-25T11:54:12.601Z",
      "date_to": "2025-05-25T21:16:12.601Z",
      "destination": "ecbbede6-0b6b-4a0d-b968-5d131c10f540",
      "is_favorite": true,
      "offers": [
        "d3f26da0-fbab-4ccd-b9cf-d159e352dfad"
      ],
      "type": "bus"
    },
    {
      "id": "5001ac68-252e-4ea4-9f03-3475ffe1281d",
      "base_price": 5739,
      "date_from": "2025-05-27T15:11:12.601Z",
      "date_to": "2025-05-28T14:49:12.601Z",
      "destination": "baedac68-2c53-44e3-b891-3db3e709653d",
      "is_favorite": false,
      "offers": [],
      "type": "sightseeing"
    },
    {
      "id": "22428bc8-df96-4def-8018-b2791e4a93e2",
      "base_price": 5528,
      "date_from": "2025-05-28T22:20:12.601Z",
      "date_to": "2025-05-29T05:56:12.601Z",
      "destination": "53834f26-a3d2-46a1-b84a-db07d6791f07",
      "is_favorite": false,
      "offers": [
        "3ee37004-3ee2-4862-a619-609cd2024034",
        "fdc6eef9-2d6e-4ba2-92b1-c74ef76011ef",
        "77560aee-2334-4ad7-8274-6de0ce37b84a"
      ],
      "type": "check-in"
    },
    {
      "id": "36fe9d22-8a31-4f35-bd5e-d1969634d215",
      "base_price": 4334,
      "date_from": "2025-05-30T16:09:12.601Z",
      "date_to": "2025-05-31T03:19:12.601Z",
      "destination": "b7fb13be-e8a2-4283-9f32-b44618094e63",
      "is_favorite": false,
      "offers": [],
      "type": "flight"
    },
    {
      "id": "47a3176c-5494-4141-90e0-8ada057a8b07",
      "base_price": 1296,
      "date_from": "2025-06-01T16:40:12.601Z",
      "date_to": "2025-06-03T08:25:12.601Z",
      "destination": "baedac68-2c53-44e3-b891-3db3e709653d",
      "is_favorite": true,
      "offers": [
        "8b48b545-89bb-4fc7-a967-88bc0086d77d",
        "99d8d058-4ddd-450d-9f15-06ee9e90d651",
        "76ee6119-a866-4bde-82be-fd8f3f5fd4a1",
        "b6e1ecf2-d916-403c-9d77-7dcbd3fccd16"
      ],
      "type": "ship"
    },
    {
      "id": "e9f3e870-dedc-415f-96d5-5434fb600395",
      "base_price": 9882,
      "date_from": "2025-06-04T04:59:12.601Z",
      "date_to": "2025-06-06T04:58:12.601Z",
      "destination": "53834f26-a3d2-46a1-b84a-db07d6791f07",
      "is_favorite": false,
      "offers": [
        "f007fc65-d325-4f96-a206-6ebfcb4ee11d"
      ],
      "type": "taxi"
    },
    {
      "id": "b959e043-0402-44ca-9293-5f108e16b110",
      "base_price": 3771,
      "date_from": "2025-06-06T13:03:12.601Z",
      "date_to": "2025-06-08T01:33:12.601Z",
      "destination": "71db3a41-cf69-47e9-be48-2c080d0db40f",
      "is_favorite": false,
      "offers": [
        "fdc6eef9-2d6e-4ba2-92b1-c74ef76011ef",
        "77560aee-2334-4ad7-8274-6de0ce37b84a"
      ],
      "type": "check-in"
    },
    {
      "id": "2571096d-a1c0-42ae-ae85-b53a84a76a71",
      "base_price": 7595,
      "date_from": "2025-06-09T12:52:12.601Z",
      "date_to": "2025-06-10T03:19:12.601Z",
      "destination": "f06f56f0-fc8e-4632-bb03-a09e290de443",
      "is_favorite": false,
      "offers": [
        "a7d13c12-44f9-497a-b70b-0f88bef1400a"
      ],
      "type": "train"
    },
    {
      "id": "f3b38d56-5eab-422d-ba1e-e4ccc3cc54e3",
      "base_price": 8373,
      "date_from": "2025-06-10T19:52:12.601Z",
      "date_to": "2025-06-11T04:23:12.601Z",
      "destination": "f06f56f0-fc8e-4632-bb03-a09e290de443",
      "is_favorite": true,
      "offers": [
        "cd7727ef-7af6-46bd-a4d8-82ffb2825ddf",
        "8b48b545-89bb-4fc7-a967-88bc0086d77d",
        "99d8d058-4ddd-450d-9f15-06ee9e90d651",
        "76ee6119-a866-4bde-82be-fd8f3f5fd4a1",
        "b6e1ecf2-d916-403c-9d77-7dcbd3fccd16"
      ],
      "type": "ship"
    },
    {
      "id": "ee81406e-aaf0-4536-bbd1-9c224cc8d423",
      "base_price": 1531,
      "date_from": "2025-06-11T14:36:12.601Z",
      "date_to": "2025-06-12T10:18:12.601Z",
      "destination": "ecbbede6-0b6b-4a0d-b968-5d131c10f540",
      "is_favorite": false,
      "offers": [
        "f007fc65-d325-4f96-a206-6ebfcb4ee11d"
      ],
      "type": "taxi"
    }
  ];

const getRandomPoint = () => getRandomArrayElement(mockPoint);
export {getRandomPoint};
