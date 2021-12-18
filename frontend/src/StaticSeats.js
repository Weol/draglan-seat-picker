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

export default function createSeats(top, left, width, height) {
    const reference = {
        Top: top,
        Left: left,
        Width: width,
        Height: height
    }

    const rows = [
        createRow(reference, 0, 5, 1),
        createRow(reference, 1, 5, 6),
        createRow(reference, 5, 5, 11),
        createRow(reference, 6, 5, 16),
        createRow(reference, 8, 5, 21),
        createRow(reference, 11, 5, 26),
        createRow(reference, 12, 5, 31),
    ]

    const firstExtra = {
        Title: 36,
        Top: 69.452,
        Left: 35.1,
        Width: width,
        Height: height,
        TTL: 30
    }

    const extra = [
        firstExtra,
    ]

    for (var i = 0; i < 4; i++) {
        extra.push(
            {
                Title: (firstExtra.Title + i + 1),
                Top: firstExtra.Top + (firstExtra.Height + 0.8) * (i + 1),
                Left: firstExtra.Left,
                Width: firstExtra.Width,
                Height: firstExtra.Height,
                TTL: firstExtra.TTL
            },
        )
    }

    const staticSeats = new Map([
        ["2052ccf8-3d0f-43e5-b595-6d770956d72c", rows[0][0]],
        ["a4c5d446-9fa3-44b8-ae97-ed699be50009", rows[0][1]],
        ["a56ba935-f0a8-47e4-bb32-e8dc94f1f9a5", rows[0][2]],
        ["cbeeade4-49ab-44fb-b40b-e90081f9ad24", rows[0][3]],
        ["bda04aeb-15a0-4f51-aaf1-748a84153b64", rows[0][4]],
        ["781b585a-dbad-4c8b-93eb-09dc3d0f7706", rows[1][0]],
        ["cff26494-d85e-4e44-8623-eea3482f3e31", rows[1][1]],
        ["c536fc3b-2bc7-4ee1-8e9b-00a79e3dbc66", rows[1][2]],
        ["ccc1ea18-ef3f-4152-99b9-dfcd9e9e2ef9", rows[1][3]],
        ["9f2ce1a0-dc2c-49af-925e-c96df97d6881", rows[1][4]],
        ["1525a4d1-e651-48a7-b439-4ce72d15183b", rows[2][0]],
        ["5766ef80-3f36-497c-8284-eeae2b5ee7b2", rows[2][1]],
        ["bb08f28a-c2b9-4ee3-99ae-4794f6ebca55", rows[2][2]],
        ["ba3206d1-e188-4158-b894-78fa3e5a7d1b", rows[2][3]],
        ["9eb5776d-6c15-4f9a-9501-a4c657984157", rows[2][4]],
        ["e6b2f060-7aa3-4fd9-b57a-dd9b648e0c01", rows[3][0]],
        ["15a1fbd6-e93e-46d1-96a5-8e89d927419c", rows[3][1]],
        ["cdc49386-eb8c-4da2-8096-a742baa92dd5", rows[3][2]],
        ["3a8e474a-aa8d-43de-bd74-7169c56b1c89", rows[3][3]],
        ["9cbdba06-3c32-4fbe-bb4f-0348c2808b46", rows[3][4]],
        // ["349f04f3-31c6-41c9-8e5c-ecf787272344", rows[4][0]],
        // ["7c7f118b-adab-4c8f-abaf-3e6404e02308", rows[4][1]],
        // ["cc01dfe8-ad67-4863-87f3-426d8fc1eabd", rows[4][2]],
        // ["be265bb6-966c-45c3-897b-6adcf38705fd", rows[4][3]],
        // ["1d6b2a97-8413-48b2-9892-ef6e2f54f722", rows[4][4]],
        ["5b08e098-bdd8-43e2-bb86-e94bd749431c", rows[5][0]],
        ["a7ac7c8c-1fe7-45f6-a9c0-a9a4ffea5857", rows[5][1]],
        ["e0bc0f28-7995-43cb-9b6f-5b500bb7c43d", rows[5][2]],
        ["3114a607-b634-4995-998b-a481c2fe69ea", rows[5][3]],
        ["4bd4a8f9-41d7-4e82-b4f7-483a92091bbe", rows[5][4]],
        ["5d41ddce-6acc-497e-b2b0-1bdbe1f3a058", rows[6][0]],
        ["5f08943a-8689-4839-9d82-fa3c3b512bc5", rows[6][1]],
        ["a4c5d446-9fa3-44b8-ae97-ed699be50209", rows[6][2]],
        ["e6b2f060-7aa3-4fd9-b57a-dd9b648e0201", rows[6][3]],
        ["15a1fbd6-e93e-46d1-96a5-8e89d927429c", rows[6][4]],
        ["322bf00c-dcf0-473d-bd8b-1e3bf79b4e99", extra[0]],
        ["2be5d23d-9edf-4e06-9409-0c56a76f1dfc", extra[1]],
        ["39158bb4-2ed9-44cc-90b7-3adac25a6bdf", extra[2]],
        ["e1fd7912-3aba-47d6-80b3-288222b7d6eb", extra[3]],
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

