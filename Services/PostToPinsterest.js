import axios from "axios";

const createPinterestPin = async ({
    title,
    description,
    imageUrl,
    link
}) => {
    const response = await axios.post(
        "https://api.pinterest.com/v5/pins",
        {
            board_id: process.env.PINTEREST_BOARD_ID,
            title,
            description,
            media_source: {
                source_type: "image_url",
                url: imageUrl
            },
            link
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};


createPinterestPin('HMK ', "HMKCOdeweb Hai ye", "", "link.comkcuhttps://i.pinimg.com/originals/9f/0f/72/9f0f72f6bbf1fb1764c5cae96ff4904f.png")