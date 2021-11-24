
const createRow = (reference, y, n, title) => {
    let row = []
    for (var i = 0; i < n; i++) {
        row.push({
            Title: (title + i),
            Top: reference.Top + reference.Height * y,
            Left: reference.Left + reference.Width * i,
            Width: reference.Width,
            Height: reference.Height
        })
    }
    return row
}

export default function createSeats(top, left, width, height)
{
    const reference = {
        Top: top,
        Left: left,
        Width: width,
        Height: height
    }

    const rows = [
        createRow(reference, 0, 7, 1),
        createRow(reference, 1, 7, 8),
        createRow(reference, 4, 7, 15),
        createRow(reference, 5, 7, 22),
        createRow(reference, 8, 7, 29),
        createRow(reference, 9, 7, 36)
    ]

    const staticSeats = new Map([
        ["5b08e098-bdd8-43e2-bb86-e94bd749431c", rows[0][0]],
        ["eb08e098-bdd8-43e2-bb86-e94bd749431c", rows[0][1]],
        ["3114a607-b634-4995-998b-a481c2fe69ea", rows[0][2]],
        ["e0bc0f28-7995-43cb-9b6f-5b500bb7c43d", rows[0][3]],
        ["a56ba935-f0a8-47e4-bb32-e8dc94f1f9a5", rows[0][4]],
        ["cbeeade4-49ab-44fb-b40b-e90081f9ad24", rows[0][5]],
        ["bda04aeb-15a0-4f51-aaf1-748a84153b64", rows[0][6]],
        ["5d41ddce-6acc-497e-b2b0-18dbe1f3a058", rows[1][0]],
        ["5f08943a-8689-4839-9d82-fa3c3b512bc5", rows[1][1]],
        ["781b585a-dbad-4c8b-93eb-09dc3d0f7706", rows[1][2]],
        ["cff26494-d85e-4e44-8623-eea3482f3e31", rows[1][3]],
        ["c536fc3b-2bc7-4ee1-8e9b-00a79e3dbc66", rows[1][4]],
        ["ccc1ea18-ef3f-4152-99b9-dfcd9e9e2ef9", rows[1][5]],
        ["9f2ce1a0-dc2c-49af-925e-c96df97d6881", rows[1][6]],
        ["a25be81b-8d90-453f-8aed-1f5ff2dd33f4", rows[2][0]],
        ["c85a1b71-e1dc-4e6f-b669-26e847087418", rows[2][1]],
        ["1525a4d1-e651-48a7-b439-4ce72d15183b", rows[2][2]],
        ["5766ef80-3f36-497c-8284-eeae2b5ee7b2", rows[2][3]],
        ["bb08f28a-c2b9-4ee3-99ae-4794f6ebca55", rows[2][4]],
        ["ba3206d1-e188-4158-b894-78fa3e5a7d1b", rows[2][5]],
        ["9eb5776d-6c15-4f9a-9501-a4c657984157", rows[2][6]],
        ["35c49f4b-3061-4597-b674-f22e60a8f351", rows[3][0]],
        ["39b4ceb2-26ff-4f11-82ca-84eb883de514", rows[3][1]],
        ["2052ccf8-3d0f-43e5-b595-6d770956d72c", rows[3][2]],
        ["9cbdba06-3c32-4fbe-bb4f-0348c2808b46", rows[3][3]],
        ["cdc49386-eb8c-4da2-8096-a742baa92dd5", rows[3][4]],
        ["3a8e474a-aa8d-43de-bd74-7169c56b1c89", rows[3][5]],
        ["4bd4a8f9-41d7-4e82-b4f7-483a92091bbe", rows[3][6]],
        ["abca5bac-336a-45b5-89dd-079f13fa0ff3", rows[4][0]],
        ["1942fac7-ecc2-4e8c-9287-a84f0aa280ad", rows[4][1]],
        ["349f04f3-31c6-41c9-8e5c-ecf787272344", rows[4][2]],
        ["7c7f118b-adab-4c8f-abaf-3e6404e02308", rows[4][3]],
        ["cc01dfe8-ad67-4863-87f3-426d8fc1eabd", rows[4][4]],
        ["be265bb6-966c-45c3-897b-6adcf38705fd", rows[4][5]],
        ["1d6b2a97-8413-48b2-9892-ef6e2f54f722", rows[4][6]],
        ["7b36e7e2-539d-4391-b898-ec801d4c7f03", rows[5][0]],
        ["d992aff7-931a-446b-ae62-66d8e2730a12", rows[5][1]],
        ["2d1fe04c-830d-4c62-964b-185fa714e624", rows[5][2]],
        ["a7ac7c8c-1fe7-45f6-a9c0-a9a4ffea5857", rows[5][3]],
        ["a4c5d446-9fa3-44b8-ae97-ed699be50009", rows[5][4]],
        ["e6b2f060-7aa3-4fd9-b57a-dd9b648e0c01", rows[5][5]],
        ["15a1fbd6-e93e-46d1-96a5-8e89d927419c", rows[5][6]],
    ])

    staticSeats.forEach((value, key) => {
        value.Id = key
        value.Top = value.Top + "%"
        value.Left = value.Left + "%"
        value.Width = value.Width + "%"
        value.Height = value.Height + "%"
    })

    return staticSeats.values()
}