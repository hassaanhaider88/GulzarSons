import express from 'express'
import { scraper } from "google-maps-review-scraper"



const router = express.Router();

router.get('/', async (req, res) => {
    // https://maps.googleapis.com/maps/api/place/details/json?placeid={place_id}&key={api_key}
    const url = "https://www.google.com/maps/place/Gulzar+Sons+Furniture/@31.7201682,72.9844361,18z/data=!4m17!1m9!3m8!1s0x39223b007dd4dc11:0x185d3ab36818d3f9!2sGulzar+Sons+Furniture!8m2!3d31.7193969!4d72.9849134!9m1!1b1!16s%2Fg%2F11y287qxk3!3m6!1s0x39223b007dd4dc11:0x185d3ab36818d3f9!8m2!3d31.7193969!4d72.9849134!10e1!16s%2Fg%2F11y287qxk3?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
    const reviews = await scraper(url, { sort_type: "highest_rating", pages: 4, clean: true })

    
    res.json({
        success: true,
        message: "Reviews Fetch Successfully",
        data: reviews
    })

})

export default router;


// import Outscraper from 'outscraper';

// let client = new Outscraper('SECRET_API_KEY');
// client.googleMapsReviews(['ChIJrc9T9fpYwokRdvjYRHT8nI4'], reviewsLimit=20, language='en').then(response => {
//     console.log(response);
// });
