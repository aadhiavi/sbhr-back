const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const router = express.Router();

let userName = '';

const botResponse = (message) => {
    const greetings = ['hi', 'hello', 'hey', 'greetings'];
    const farewellKeywords = ['bye', 'goodbye', 'see you', 'take care', 'thank you'];
    const hotelInquiryKeywords = ['hotel', 'resort', 'venues', 'accommodations'];
    const retreatKeywords = ['retreat', 'booking', 'schedule tour'];
    const contactKeywords = ['contact', 'phone', 'mail', 'connect', 'number'];
    const addressKeywords = ['address', 'location'];
    const samadhanaKeywords = ['samadhana', 'hyderabad'];
    const samaikyathaKeywords = ['samaikyatha', 'guntur'];
    const roomKeywords = ['rooms', 'accommodations', 'lodging'];
    const facilityKeywords = ['facilities', 'technology', 'amenities'];
    const diningKeywords = ['dining', 'food', 'catering', 'menu', 'restaurant'];
    const eventKeywords = ['wedding', 'meeting', 'event', 'conference', 'gathering','halls'];

    // Handle greetings
    if (greetings.some(greet => message.toLowerCase().includes(greet))) {
        if (!userName) {
            return "Hi there! What's your name?";
        } else {
            return `Hello, ${userName}! Welcome to Suhana Beulah Hotels & Resorts. How can I assist you today?`;
        }
    } 

    // Handle name introduction
    else if (message.toLowerCase().startsWith('my name is ')) {
        userName = message.slice(11).trim();
        return `Nice to meet you, ${userName}! What information are you looking for?`;
    }

    // Handle hotel inquiries
    else if (hotelInquiryKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return "We offer two beautiful venues: Samadhana Sadhan in Hyderabad and Samaikyatha Sadhan in Guntur. What specific information are you looking for?";
    }

    // Handle retreat inquiries
    else if (retreatKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return "Both venues are designed for retreats, accommodating groups from 10 to 1,000 people, with lodging, recreational activities, and expert coordinators.";
    }

    // Handle room inquiries
    else if (roomKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            We offer various accommodation options:
            - **Executive Double Occupancy Rooms**: King-size beds, en-suite bathrooms, and a work desk.
            - **Luxury 2 BHK Accommodations**: Separate bedrooms and kitchenette for families or groups.
            - **4-bedded and 8-bedded Rooms**: Ideal for smaller groups.
            - **40-bedded Dorms**: Great for retreats or youth camps.
        `;
    }

    // Handle facility inquiries
    else if (facilityKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            Our facilities include:
            - Meeting and delegate rooms with modern audiovisual technology.
            - Flexible seating arrangements.
            - On-site laundry services and comfortable lounge areas.
        `;
    }

    // Handle dining inquiries
    else if (diningKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            Our dining halls can accommodate 300 to 1,500 guests. We offer:
            - A diverse menu featuring local dishes like Hyderabadi Dum Biryani.
            - Customizable menus for dietary restrictions.
            - Catering services for outdoor events.
        `;
    }

    // Handle event inquiries
    else if (eventKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            We have a stunning wedding and convention hall for large events, accommodating up to 1,000 guests.
            - **Chapel Meeting Space**: Seats up to 100 guests for intimate gatherings.
            - Conference rooms equipped with high-speed Wi-Fi and projection screens.
        `;
    }

    // Handle individual resort details
    else if (samadhanaKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            **Samadhana Sadhan**:
            - Location: Ponallu Village, Shameerpet, Medchal-Malkajgiri district, Hyderabad 500078
            - Capacity: Accommodates groups from 10 to 1,000 people
            - Facilities: Comfortable lodging, recreational activities, and expert event coordinators.
        `;
    }

    else if (samaikyathaKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            **Samaikyatha Sadhan**:
            - Location: 782C+F2J, Opposite St. ANN'S COLLEGE OF NURSING COLLEGE, Chowdavaram, Andhra Pradesh 522529
            - Capacity: Ideal for large gatherings and events
            - Facilities: Spacious halls, dining area, and outdoor spaces for events.
        `;
    }

    // Handle contact inquiries
    else if (contactKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return "You can connect with us at\nphone: +91 7793979849\nemail: sbhrhyd@gmail.com.\n We're here to help!";
    }

    // Handle address inquiries
    else if (addressKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `
            Our addresses are as follows:
            - **Head Office**: Plot No 128, Gate Number 6, Sitaram Nagar, Gunrock Enclave, Secunderabad, Telangana 500009
            - **Samadhana Sadhan**: Ponallu Village, Shameerpet, Medchal-Malkajgiri district, Hyderabad 500078
            - **Samaikyatha Sadhan**: 782C+F2J, Opposite St. ANN'S COLLEGE OF NURSING COLLEGE, Chowdavaram, Andhra Pradesh 522529
        `;
    }

    // Handle farewells
    else if (farewellKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return `Goodbye ${userName || ''}! We look forward to assisting you again!`;
    }

    // Default response for unrecognized input
    return `Sorry, I didn't quite understand this "${message}". Could you please explain it in more detail?`; 
};

router.post('/message', async (req, res) => {
    const userMessage = req.body.message;
    const response = botResponse(userMessage);
    
    const chatMessage = new ChatMessage({ userMessage, botResponse: response });
    await chatMessage.save();

    res.json({ response });
});

router.get('/messages', async (req, res) => {
    const messages = await ChatMessage.find();
    res.json(messages);
});

router.delete('/clear', async (req, res) => {
    await ChatMessage.deleteMany({});
    res.json({ message: 'Chat cleared successfully!' });
});


module.exports = router;
