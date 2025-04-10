import {useState, useEffect, useRef} from 'react';
import en from "./en.json";
import bn from "./bn.json";
import es from "./es.json";
import my from "./my.json";

export const translations = {
    en
    // en,bn,es,my
};

const getTranslation = ()=> {
    const [language, setLanguage] = useState("en");
    useEffect(() => {
        const savedLanguage = localStorage.getItem("user_language");
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);
    return translations[language];
}

export default  getTranslation;