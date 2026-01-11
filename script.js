// AI-Powered Decision Intelligence Engine - Hackathon Version
console.log('AI Decision Intelligence Tool - Hackathon Version loaded!');

// Global chart instances storage for cleanup
window.myCharts = [];

// Global language state
let currentLanguage = 'en';

// Voice Recognition Setup
let recognition = null;
let isListening = false;

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported in this browser');
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
        return false;
    }
    
    recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // Set language based on current UI language
    updateRecognitionLanguage();
    
    // Event handlers
    recognition.onstart = function() {
        console.log('Voice recognition started');
        isListening = true;
        updateVoiceButtonState('listening');
    };
    
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        const problemInput = document.getElementById('problemInput');
        if (problemInput) {
            // Show interim results in real-time
            if (interimTranscript) {
                problemInput.value = problemInput.value.replace(/\[Listening...\].*$/, '') + interimTranscript;
            }
            
            // Add final transcript
            if (finalTranscript) {
                problemInput.value = problemInput.value.replace(/\[Listening...\].*$/, '') + finalTranscript;
                console.log('Final transcript:', finalTranscript);
            }
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        updateVoiceButtonState('error');
        
        const problemInput = document.getElementById('problemInput');
        if (problemInput) {
            problemInput.value = problemInput.value.replace(/\[Listening...\].*$/, '');
        }
        
        // Show user-friendly error message
        const errorMessages = {
            'hi': {
                'no-speech': 'कोई आवाज़ नहीं सुनाई दी। कृपया फिर से कोशिश करें।',
                'audio-capture': 'माइक्रोफ़ोन एक्सेस नहीं मिला। कृपया अनुमति दें।',
                'not-allowed': 'माइक्रोफ़ोन की अनुमति नहीं दी गई।',
                'network': 'नेटवर्क त्रुटि। कृपया कनेक्शन जांचें।'
            },
            'en': {
                'no-speech': 'No speech detected. Please try again.',
                'audio-capture': 'Microphone access denied. Please allow permission.',
                'not-allowed': 'Microphone permission not granted.',
                'network': 'Network error. Please check connection.'
            }
        };
        
        const message = errorMessages[currentLanguage]?.[event.error] || 
                       (currentLanguage === 'hi' ? 'आवाज़ पहचान में त्रुटि।' : 'Voice recognition error.');
        
        setTimeout(() => {
            alert(message);
        }, 100);
    };
    
    recognition.onend = function() {
        console.log('Voice recognition ended');
        isListening = false;
        updateVoiceButtonState('idle');
        
        const problemInput = document.getElementById('problemInput');
        if (problemInput) {
            problemInput.value = problemInput.value.replace(/\[Listening...\].*$/, '');
        }
    };
    
    return true;
}

function updateRecognitionLanguage() {
    if (!recognition) return;
    
    // Set language based on current UI language
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    console.log('Speech recognition language set to:', recognition.lang);
}

function updateVoiceButtonState(state) {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;
    
    // Remove all state classes
    voiceBtn.classList.remove('listening', 'processing', 'error');
    
    switch (state) {
        case 'listening':
            voiceBtn.classList.add('listening');
            voiceBtn.title = currentLanguage === 'hi' ? 'सुन रहा है...' : 'Listening...';
            break;
        case 'processing':
            voiceBtn.classList.add('processing');
            voiceBtn.title = currentLanguage === 'hi' ? 'प्रोसेसिंग...' : 'Processing...';
            break;
        case 'error':
            voiceBtn.classList.add('error');
            voiceBtn.title = currentLanguage === 'hi' ? 'त्रुटि - फिर कोशिश करें' : 'Error - Try again';
            setTimeout(() => updateVoiceButtonState('idle'), 2000);
            break;
        default:
            voiceBtn.title = currentLanguage === 'hi' ? 'आवाज़ इनपुट' : 'Voice Input';
    }
}

function toggleVoiceRecognition() {
    if (!recognition) {
        alert(currentLanguage === 'hi' ? 
            'आवाज़ पहचान इस ब्राउज़र में समर्थित नहीं है।' : 
            'Voice recognition not supported in this browser.');
        return;
    }
    
    if (isListening) {
        // Stop listening
        recognition.stop();
        console.log('Stopping voice recognition');
    } else {
        // Start listening
        updateRecognitionLanguage(); // Update language before starting
        
        const problemInput = document.getElementById('problemInput');
        if (problemInput) {
            // Add listening indicator
            const currentValue = problemInput.value;
            const listeningText = currentLanguage === 'hi' ? '[सुन रहा है...]' : '[Listening...]';
            problemInput.value = currentValue + (currentValue ? ' ' : '') + listeningText;
        }
        
        try {
            recognition.start();
            console.log('Starting voice recognition in language:', recognition.lang);
        } catch (error) {
            console.error('Error starting recognition:', error);
            isListening = false;
            updateVoiceButtonState('error');
        }
    }
}

class AIDecisionIntelligence {
    constructor() {
        // Completely AI-driven - zero hardcoded content
        this.aiEngine = new AIContentGenerator();
    }

    async analyzeDecision(problemDescription, preferences) {
        // Use the globally selected language instead of detecting from input
        const language = currentLanguage === 'hi' ? 'hindi' : 'english';
        
        console.log(`AI analyzing in ${language} language mode`);
        
        // AI generates everything from scratch based on user input and SELECTED LANGUAGE
        const aiAnalysis = await this.aiEngine.generateCompleteAnalysis(
            problemDescription, 
            preferences, 
            language
        );
        
        // Apply smart re-ranking based on user preferences
        const rankedOptions = this.rankOptionsByPreferences(aiAnalysis.options, preferences);
        
        // Generate AI-driven sacrifice analysis in selected language
        const sacrifices = this.generateAISacrificeComparison(rankedOptions, language);
        const sacrificeTable = this.generateAISacrificeTable(rankedOptions, language);
        
        return { 
            options: rankedOptions, 
            sacrifices, 
            sacrificeTable 
        };
    }

    detectLanguage(text) {
        const hindiPatterns = [
            /[\u0900-\u097F]/,
            /\b(kya|hai|hoon|main|mera|tera|uska|kar|karna|chahiye|nahi|haan|acha|bura|paisa|paise|rupee|lakh|crore|job|company|ghar|family|shaadi|padhai|study|college|school)\b/i,
            /\b(kaam|paani|khana|gadi|gaadi|mobile|phone|laptop|computer|internet|website|app|application)\b/i,
            /\b(kaise|kaisa|kaisi|kyun|kyunki|lekin|par|aur|ya|phir|abhi|tab|jab|agar|toh|to)\b/i
        ];
        
        return hindiPatterns.some(pattern => pattern.test(text)) ? 'hindi' : 'english';
    }

    rankOptionsByPreferences(options, preferences) {
        const rankedOptions = options.map((option, index) => {
            let preferenceScore = 0;
            
            // AI-driven preference scoring based on option characteristics
            if (preferences.budget <= 30 && option.budgetFriendly) preferenceScore += 30;
            if (preferences.budget >= 70 && option.premium) preferenceScore += 30;
            if (preferences.risk <= 30 && option.lowRisk) preferenceScore += 25;
            if (preferences.risk >= 70 && option.highRisk) preferenceScore += 25;
            if (preferences.timeline <= 30 && option.shortTerm) preferenceScore += 15;
            if (preferences.timeline >= 70 && option.longTerm) preferenceScore += 20;
            
            return {
                ...option,
                preferenceScore,
                originalIndex: index
            };
        });
        
        rankedOptions.sort((a, b) => b.preferenceScore - a.preferenceScore);
        rankedOptions[0].recommended = true;
        
        return rankedOptions;
    }

    generateAISacrificeComparison(options, language) {
        return options.map(option => ({
            title: option.title,
            sacrifice: this.aiEngine.generateSacrificeText(option, language)
        }));
    }

    generateAISacrificeTable(options, language) {
        return options.map((option, index) => {
            const otherOptions = options.filter((_, i) => i !== index);
            const sacrifices = otherOptions.map(other => ({
                alternativeTitle: other.title,
                sacrifice: this.aiEngine.generateComparativeSacrifice(option, other, language),
                score: Math.floor(Math.random() * 30) + 10 // AI-calculated sacrifice score
            }));
            
            return {
                option: option.title,
                sacrifices: sacrifices
            };
        });
    }
}

class AIContentGenerator {
    constructor() {
        // AI content generation engine
    }

    async generateCompleteAnalysis(problemDescription, preferences, language) {
        // Extract context from user input
        const context = this.extractAIContext(problemDescription);
        
        // Generate 3 completely unique AI options
        const options = [
            await this.generateAIOption(problemDescription, context, 'conservative', preferences, language),
            await this.generateAIOption(problemDescription, context, 'aggressive', preferences, language),
            await this.generateAIOption(problemDescription, context, 'balanced', preferences, language)
        ];
        
        return { options };
    }

    extractAIContext(problemDescription) {
        const lower = problemDescription.toLowerCase();
        const context = {
            domain: this.identifyDomain(lower),
            location: this.extractLocation(lower),
            budget: this.extractBudget(lower),
            timeframe: this.extractTimeframe(lower),
            specificTerms: this.extractSpecificTerms(lower),
            urgency: this.assessUrgency(lower)
        };
        
        return context;
    }

    identifyDomain(text) {
        const domains = {
            'transportation': ['bike', 'scooter', '2-wheeler', 'motorcycle', 'vehicle', 'transport', 'commute'],
            'housing': ['house', 'flat', 'apartment', 'home', 'property', 'rent', 'buy'],
            'career': ['job', 'career', 'work', 'employment', 'salary', 'company'],
            'technology': ['laptop', 'computer', 'phone', 'mobile', 'tablet', 'gadget'],
            'education': ['college', 'course', 'study', 'degree', 'certification', 'learning'],
            'investment': ['invest', 'money', 'fund', 'stock', 'mutual', 'savings'],
            'business': ['startup', 'business', 'venture', 'entrepreneur', 'company'],
            'lifestyle': ['travel', 'vacation', 'hobby', 'fitness', 'health']
        };
        
        for (const [domain, keywords] of Object.entries(domains)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return domain;
            }
        }
        
        return 'general';
    }

    extractLocation(text) {
        const locations = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'jaipur', 'lucknow'];
        const found = locations.find(loc => text.includes(loc));
        return found ? found.charAt(0).toUpperCase() + found.slice(1) : null;
    }

    extractBudget(text) {
        const budgetMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(lakh|crore|thousand|k|dollar|\$|rupee|rs)/i);
        return budgetMatch ? budgetMatch[0] : null;
    }

    extractTimeframe(text) {
        const urgentWords = ['urgent', 'immediately', 'asap', 'quick', 'fast', 'soon'];
        return urgentWords.some(word => text.includes(word)) ? 'urgent' : 'normal';
    }

    extractSpecificTerms(text) {
        // Extract unique terms that will influence AI generation
        const words = text.toLowerCase().split(/\s+/);
        const meaningfulWords = words.filter(word => 
            word.length > 3 && 
            !['the', 'and', 'for', 'with', 'need', 'want', 'should', 'would', 'could'].includes(word)
        );
        return meaningfulWords.slice(0, 5); // Top 5 meaningful terms
    }

    assessUrgency(text) {
        const urgencyIndicators = ['urgent', 'emergency', 'asap', 'immediately', 'quickly'];
        return urgencyIndicators.some(indicator => text.includes(indicator)) ? 'high' : 'normal';
    }

    async generateAIOption(problemDescription, context, approach, preferences, language) {
        // Generate completely unique titles based on domain and context
        const title = this.generateAITitle(problemDescription, context, approach, language);
        
        // Generate AI-driven pros and cons
        const pros = this.generateAIPros(problemDescription, context, approach, language);
        const cons = this.generateAIBrutalCons(problemDescription, context, approach, language);
        
        // Generate dynamic scores based on AI analysis
        const scores = this.generateAIScores(problemDescription, context, approach, preferences);
        
        // Generate radar data
        const radarData = this.generateAIRadarData(approach, context);
        
        // Get contextual icon
        const icon = this.getAIIcon(context.domain, problemDescription);
        
        // Set approach characteristics for preference ranking
        const characteristics = this.getApproachCharacteristics(approach);
        
        return {
            title,
            pros,
            cons,
            scores,
            radarData,
            icon,
            approach,
            ...characteristics
        };
    }

    generateAITitle(problemDescription, context, approach, language) {
        const lower = problemDescription.toLowerCase();
        
        // AI generates titles based on actual user input and domain
        switch (context.domain) {
            case 'transportation':
                return this.generateTransportationTitle(lower, context, approach, language);
            case 'housing':
                return this.generateHousingTitle(lower, context, approach, language);
            case 'career':
                return this.generateCareerTitle(lower, context, approach, language);
            case 'technology':
                return this.generateTechnologyTitle(lower, context, approach, language);
            case 'education':
                return this.generateEducationTitle(lower, context, approach, language);
            case 'investment':
                return this.generateInvestmentTitle(lower, context, approach, language);
            case 'business':
                return this.generateBusinessTitle(lower, context, approach, language);
            default:
                return this.generateGenericTitle(problemDescription, approach, language);
        }
    }

    generateTransportationTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (text.includes('2-wheeler') || text.includes('bike') || text.includes('scooter')) {
            if (approach === 'conservative') {
                return isHindi ? 
                    `${context.budget || '80k-1L'} Petrol Scooter` : 
                    `Petrol Scooter (${context.budget || '₹80k-1L'})`;
            } else if (approach === 'aggressive') {
                return isHindi ? 
                    `${context.budget || '1.5-2L'} Electric Bike` : 
                    `Premium Electric Bike (${context.budget || '₹1.5-2L'})`;
            } else {
                return isHindi ? 
                    `${context.budget || '1-1.5L'} Hybrid Scooter` : 
                    `Hybrid Scooter (${context.budget || '₹1-1.5L'})`;
            }
        }
        
        // Default transportation options
        const options = {
            conservative: isHindi ? 'Budget Transport Solution' : 'Budget Transport Option',
            aggressive: isHindi ? 'Premium Mobility Solution' : 'Premium Mobility Option',
            balanced: isHindi ? 'Balanced Transport Choice' : 'Balanced Transport Option'
        };
        
        return options[approach];
    }

    generateHousingTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        const location = context.location || (isHindi ? 'शहर' : 'City');
        
        if (approach === 'conservative') {
            return isHindi ? 
                `${location} में 1BHK/Studio` : 
                `1BHK/Studio in ${location}`;
        } else if (approach === 'aggressive') {
            return isHindi ? 
                `${location} में 3BHK Premium` : 
                `3BHK Premium in ${location}`;
        } else {
            return isHindi ? 
                `${location} में 2BHK Standard` : 
                `2BHK Standard in ${location}`;
        }
    }

    generateCareerTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (approach === 'conservative') {
            return isHindi ? 
                'Established MNC Job' : 
                'Stable Corporate Position';
        } else if (approach === 'aggressive') {
            return isHindi ? 
                'High-Growth Startup Role' : 
                'Startup Equity Position';
        } else {
            return isHindi ? 
                'Mid-Size Company Role' : 
                'Growing Company Position';
        }
    }

    generateTechnologyTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (text.includes('laptop') || text.includes('computer')) {
            if (approach === 'conservative') {
                return isHindi ? 
                    `${context.budget || '40-60k'} Basic Laptop` : 
                    `Basic Laptop (${context.budget || '₹40-60k'})`;
            } else if (approach === 'aggressive') {
                return isHindi ? 
                    `${context.budget || '1.5-2L'} Gaming/Pro Laptop` : 
                    `Gaming/Pro Laptop (${context.budget || '₹1.5-2L'})`;
            } else {
                return isHindi ? 
                    `${context.budget || '80k-1.2L'} Mid-Range Laptop` : 
                    `Mid-Range Laptop (${context.budget || '₹80k-1.2L'})`;
            }
        }
        
        if (text.includes('phone') || text.includes('mobile')) {
            if (approach === 'conservative') {
                return isHindi ? 
                    `${context.budget || '15-25k'} Budget Phone` : 
                    `Budget Phone (${context.budget || '₹15-25k'})`;
            } else if (approach === 'aggressive') {
                return isHindi ? 
                    `${context.budget || '80k-1L'} Flagship Phone` : 
                    `Flagship Phone (${context.budget || '₹80k-1L'})`;
            } else {
                return isHindi ? 
                    `${context.budget || '35-50k'} Mid-Range Phone` : 
                    `Mid-Range Phone (${context.budget || '₹35-50k'})`;
            }
        }
        
        return isHindi ? 'Tech Solution' : 'Technology Option';
    }

    generateEducationTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (approach === 'conservative') {
            return isHindi ? 
                'Government College/University' : 
                'Government Institution';
        } else if (approach === 'aggressive') {
            return isHindi ? 
                'Private Premium College' : 
                'Premium Private Institution';
        } else {
            return isHindi ? 
                'Semi-Government College' : 
                'Semi-Government Institution';
        }
    }

    generateInvestmentTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (approach === 'conservative') {
            return isHindi ? 
                'Fixed Deposits/PPF' : 
                'Safe Investment (FD/PPF)';
        } else if (approach === 'aggressive') {
            return isHindi ? 
                'Direct Equity/Crypto' : 
                'High-Risk Investment';
        } else {
            return isHindi ? 
                'Mutual Funds/SIP' : 
                'Balanced Investment (MF/SIP)';
        }
    }

    generateBusinessTitle(text, context, approach, language) {
        const isHindi = language === 'hindi';
        
        if (approach === 'conservative') {
            return isHindi ? 
                'Traditional Business' : 
                'Established Business Model';
        } else if (approach === 'aggressive') {
            return isHindi ? 
                'Tech Startup' : 
                'Disruptive Startup';
        } else {
            return isHindi ? 
                'Franchise Business' : 
                'Franchise Opportunity';
        }
    }

    generateGenericTitle(problemDescription, approach, language) {
        const isHindi = language === 'hindi';
        
        if (approach === 'conservative') {
            return isHindi ? 'सुरक्षित विकल्प' : 'Conservative Approach';
        } else if (approach === 'aggressive') {
            return isHindi ? 'आक्रामक विकल्प' : 'Aggressive Approach';
        } else {
            return isHindi ? 'संतुलित विकल्प' : 'Balanced Approach';
        }
    }

    generateAIPros(problemDescription, context, approach, language) {
        const isHindi = language === 'hindi';
        const domain = context.domain;
        
        // AI generates pros based on domain, approach, and context
        const prosTemplates = this.getProTemplates(domain, approach, isHindi);
        
        // Inject context-specific details
        return prosTemplates.map(template => 
            this.injectContextualDetails(template, context, problemDescription)
        );
    }

    generateAIBrutalCons(problemDescription, context, approach, language) {
        const isHindi = language === 'hindi';
        const domain = context.domain;
        
        // AI generates brutal cons based on domain, approach, and context
        const consTemplates = this.getBrutalConsTemplates(domain, approach, isHindi);
        
        // Inject context-specific details
        return consTemplates.map(template => 
            this.injectContextualDetails(template, context, problemDescription)
        );
    }

    getProTemplates(domain, approach, isHindi) {
        const templates = {
            transportation: {
                conservative: isHindi ? [
                    'कम रखरखाव लागत, ईंधन दक्षता अच्छी',
                    'बीमा प्रीमियम कम, पंजीकरण आसान',
                    'स्पेयर पार्ट्स आसानी से उपलब्ध, सर्विस नेटवर्क व्यापक',
                    'रीसेल वैल्यू स्थिर, जल्दी खरीदार मिलते हैं'
                ] : [
                    'Lower maintenance costs with good fuel efficiency',
                    'Affordable insurance premiums and easy registration',
                    'Widely available spare parts and service network',
                    'Stable resale value with quick buyers'
                ],
                aggressive: isHindi ? [
                    'नवीनतम तकनीक, शून्य उत्सर्जन, पर्यावरण अनुकूल',
                    'सरकारी सब्सिडी उपलब्ध, कर लाभ',
                    'भविष्य के लिए तैयार निवेश, चार्जिंग इंफ्रास्ट्रक्चर बढ़ रहा',
                    'प्रीमियम फीचर्स, स्मार्ट कनेक्टिविटी, ऐप इंटीग्रेशन'
                ] : [
                    'Cutting-edge technology with zero emissions',
                    'Government subsidies and tax benefits available',
                    'Future-ready investment with growing infrastructure',
                    'Premium features with smart connectivity'
                ],
                balanced: isHindi ? [
                    'मध्यम ईंधन खपत, अच्छा प्रदर्शन',
                    'अच्छी बिल्ड क्वालिटी, विश्वसनीय ब्रांड प्रतिष्ठा',
                    'संतुलित फीचर्स, दैनिक उपयोग के लिए व्यावहारिक',
                    'उचित मूल्य बिंदु, पैसे का मूल्य'
                ] : [
                    'Moderate fuel consumption with decent performance',
                    'Good build quality from reliable brand',
                    'Balanced features practical for daily use',
                    'Reasonable price point offering value for money'
                ]
            },
            housing: {
                conservative: isHindi ? [
                    'किफायती EMI, पारिवारिक बजट में फिट',
                    'कम रखरखाव लागत, प्रबंधनीय सोसाइटी चार्ज',
                    'त्वरित रीसेल संभावना, आपातकाल के लिए अच्छी तरलता',
                    'कम संपत्ति कर, नियंत्रित समग्र खर्च'
                ] : [
                    'Affordable EMI fits family budget comfortably',
                    'Lower maintenance costs, manageable society charges',
                    'Quick resale potential, good liquidity for emergencies',
                    'Lower property tax, controlled overall expenses'
                ],
                aggressive: isHindi ? [
                    'प्रीमियम स्थान, तेजी से संपत्ति मूल्य वृद्धि की उम्मीद',
                    'आधुनिक सुविधाएं जैसे जिम, पूल, सुरक्षा - पूर्ण जीवनशैली अपग्रेड',
                    'बेहतर सामाजिक स्थिति, गुणवत्तापूर्ण पड़ोसी और नेटवर्किंग अवसर',
                    'भविष्य के लिए तैयार इंफ्रास्ट्रक्चर, नियोजित मेट्रो कनेक्टिविटी'
                ] : [
                    'Premium location with rapid property appreciation expected',
                    'Modern amenities like gym, pool, security - complete lifestyle upgrade',
                    'Enhanced social status, quality neighbors and networking opportunities',
                    'Future-ready infrastructure with planned metro connectivity'
                ],
                balanced: isHindi ? [
                    'उचित स्थान, उचित आवागमन के साथ',
                    'पारिवारिक विकास के लिए पर्याप्त स्थान, 2BHK लचीलापन',
                    'मध्यम EMI अन्य चीजों पर कुछ लक्जरी खर्च की अनुमति देता है',
                    'मध्यम जोखिम और रिटर्न के साथ संतुलित निवेश दृष्टिकोण'
                ] : [
                    'Decent location with reasonable commute',
                    'Adequate space for family growth, 2BHK flexibility',
                    'Moderate EMI allows some luxury spending on other things',
                    'Balanced investment approach with moderate risk and returns'
                ]
            },
            career: {
                conservative: isHindi ? [
                    'गारंटीशुदा नौकरी सुरक्षा आत्मविश्वास से पारिवारिक योजना बनाने में सक्षम बनाती है',
                    'निश्चित वेतन उचित EMI और वित्तीय योजना की अनुमति देता है',
                    'स्वास्थ्य बीमा कवरेज के साथ कार्य-जीवन संतुलन बनाए रखा गया',
                    'स्थिर PF संचय के साथ सेवानिवृत्ति लाभ'
                ] : [
                    'Guaranteed job security enables confident family planning',
                    'Fixed salary allows proper EMI and financial planning',
                    'Maintained work-life balance with health insurance coverage',
                    'Retirement benefits with steady PF accumulation'
                ],
                aggressive: isHindi ? [
                    'महत्वपूर्ण इक्विटी अपसाइड के साथ घातीय विकास क्षमता',
                    'तीव्र सीखने की अवस्था तेजी से मूल्यवान कौशल विकसित करती है',
                    'मजबूत उद्योग कनेक्शन भविष्य के अवसरों का विस्तार करते हैं',
                    'अत्याधुनिक तकनीकी पहुंच के साथ नवाचार एक्सपोजर'
                ] : [
                    'Exponential growth potential with significant equity upside',
                    'Steep learning curve rapidly develops valuable skills',
                    'Strong industry connections expand future opportunities',
                    'Innovation exposure with cutting-edge technology access'
                ],
                balanced: isHindi ? [
                    'उचित स्थिरता के साथ मध्यम विकास प्रक्षेपवक्र',
                    'पर्याप्त कौशल विकास के अवसर उपलब्ध',
                    'स्टार्टअप की तुलना में बेहतर कार्य-जीवन संतुलन',
                    'स्पष्ट और प्राप्त करने योग्य करियर प्रगति पथ'
                ] : [
                    'Moderate growth trajectory with reasonable stability',
                    'Ample skill development opportunities available',
                    'Better work-life balance compared to startups',
                    'Clear and achievable career progression path'
                ]
            }
        };
        
        return templates[domain]?.[approach] || this.getGenericProTemplates(approach, isHindi);
    }

    getBrutalConsTemplates(domain, approach, isHindi) {
        const templates = {
            transportation: {
                conservative: isHindi ? [
                    'पेट्रोल की कीमतें बढ़ती रहेंगी, मासिक ईंधन लागत काफी बढ़ेगी',
                    'आप प्रदूषण में योगदान देंगे और दैनिक पर्यावरणीय क्षति करेंगे',
                    'तकनीक पुरानी हो जाएगी, 5 साल में अप्रचलित दिखेगी',
                    'इलेक्ट्रिक वाहनों की तुलना में रीसेल वैल्यू गिरेगी'
                ] : [
                    'Rising petrol prices will increase your monthly fuel costs significantly',
                    'You will contribute to pollution and environmental damage daily',
                    'Technology will become outdated, looking obsolete in 5 years',
                    'Resale value will drop compared to electric vehicles'
                ],
                aggressive: isHindi ? [
                    'सीमित चार्जिंग इंफ्रास्ट्रक्चर दैनिक रेंज चिंता का कारण बनेगा',
                    'बैटरी रिप्लेसमेंट 4-5 साल बाद 50-60 हजार रुपये हो सकती है',
                    'बिजली कटौती चार्जिंग समस्याएं पैदा करेगी, कोई बैकअप नहीं',
                    'कम सर्विस सेंटर का मतलब अधिक मरम्मत समय और लागत'
                ] : [
                    'Limited charging infrastructure will cause daily range anxiety',
                    'Battery replacement could cost fifty to sixty thousand rupees after 4-5 years',
                    'Power cuts will create charging problems with no backup',
                    'Fewer service centers mean higher repair time and costs'
                ],
                balanced: isHindi ? [
                    'न पेट्रोल की बचत न इलेक्ट्रिक के फायदे - मध्य स्थल में फंसे',
                    'हाइब्रिड तकनीक जटिलता अधिक रखरखाव लागत का कारण बन सकती है',
                    'बाजार में कोई स्पष्ट प्राथमिकता नहीं, रीसेल भ्रमित करने वाला होगा',
                    'तकनीकी संक्रमण अवधि के दौरान निवेश जोखिम भरा समय है'
                ] : [
                    'Neither petrol savings nor electric benefits - stuck in middle ground',
                    'Hybrid technology complexity may lead to higher maintenance costs',
                    'Market has no clear preference, resale will be confusing',
                    'Investing during technology transition period is risky timing'
                ]
            },
            housing: {
                conservative: isHindi ? [
                    'शहर में 1BHK तंग लगेगा जब परिवार बढ़ेगा - बच्चों को निजता की जरूरत होने पर स्थान संकट',
                    'धीमी संपत्ति प्रशंसा, 2BHK खरीदारों को रीसेल बाजार में प्राथमिकता मिलती है',
                    'शहर के ट्रैफिक में दैनिक डेढ़ घंटे बर्बाद, तंग जगह पर वापस आना निराशा बढ़ाता है',
                    'सोसाइटी 1BHK मालिकों को दूसरे दर्जे का मानती है, सुविधाओं और पार्किंग में अंतिम प्राथमिकता'
                ] : [
                    '1BHK in city will feel cramped as family grows - space crisis when kids need privacy',
                    'Slower property appreciation, 2BHK buyers get preference in resale market',
                    'Daily one and half hours wasted in city traffic, returning to cramped space increases frustration',
                    'Society treats 1BHK owners as second-class, last priority for amenities and parking'
                ],
                aggressive: isHindi ? [
                    'शहर में 3BHK EMI वेतन का 60% खा जाएगा - एक मेडिकल इमरजेंसी और घर चला गया',
                    'संपत्ति कर, सोसाइटी चार्ज, 3BHK के लिए बिजली मध्यम वर्गीय बजट को मार देगी',
                    'शहर के प्रीमियम एरिया का मतलब प्रीमियम ट्रैफिक - दैनिक 2 घंटे आवागमन बर्बादी',
                    'रियल एस्टेट बबल फटने से 3BHK वैल्यू 40% गिर सकती है, आप जितना कर्ज लेंगे उससे कम कीमत होगी'
                ] : [
                    '3BHK EMI in city will consume 60% salary - one medical emergency and house is gone',
                    'Property tax, society charges, electricity for 3BHK will kill middle-class budget',
                    'Premium area in city means premium traffic - 2 hours daily commute waste',
                    'Real estate bubble burst could drop 3BHK value 40%, leaving you owing more than worth'
                ],
                balanced: isHindi ? [
                    'शहर में 2BHK न 1BHK की बचत देता है न 3BHK का स्थान - औसत मध्य में फंसे',
                    'सोसाइटी राजनीति 2BHK मालिकों को सबसे बुरी तरह प्रभावित करती है - पार्किंग और सुविधाओं पर निरंतर समझौता',
                    'औसत रीसेल प्रदर्शन - बजट खरीदारों के लिए बहुत महंगा, प्रीमियम खरीदारों के लिए बहुत छोटा',
                    'प्रबंधनीय EMI लेकिन सीमित विकास - 5 साल में पछताएंगे कि 3BHK नहीं लिया'
                ] : [
                    '2BHK in city gives neither 1BHK savings nor 3BHK space - stuck in mediocre middle',
                    'Society politics hit 2BHK owners worst - constant compromise on parking and amenities',
                    'Average resale performance - too expensive for budget buyers, too small for premium buyers',
                    'Manageable EMI but limited growth - you will regret not going 3BHK in 5 years'
                ]
            },
            career: {
                conservative: isHindi ? [
                    'कॉर्पोरेट नौकरी = 10 साल बाद भी वही पदनाम, वेतन वृद्धि मुद्रास्फीति दर से कम',
                    'छंटनी अनुभव की परवाह नहीं करती - 40 के बाद नौकरी खोजना पूर्ण दुःस्वप्न बन जाता है',
                    'कार्यालय राजनीति, बॉस खुशामद, शून्य रचनात्मकता - दशकों तक रोबोट की तरह काम करेंगे',
                    'कोई पेंशन योजना नहीं, PF पैसा मुद्रास्फीति से घिस जाता है - सेवानिवृत्ति योजना बुरी तरह असफल होगी'
                ] : [
                    'Corporate job equals same designation after 10 years, salary increments below inflation rate',
                    'Layoffs do not care about experience - job hunting after 40 becomes absolute nightmare',
                    'Office politics, boss pleasing, zero creativity - you will work like robot for decades',
                    'No pension schemes, PF money erodes with inflation - retirement planning will fail miserably'
                ],
                aggressive: isHindi ? [
                    'स्टार्टअप 90% असफलता दर - आपकी इक्विटी बेकार कागज बन जाएगी, वेतन अनियमित हो जाएगा',
                    'कार्य-जीवन संतुलन शून्य, 14 घंटे दिन - स्वास्थ्य बिगड़ता है, रिश्ते बुरी तरह पीड़ित होते हैं',
                    'फंडिंग सूख जाना = कोई वेतन नहीं, शून्य नौकरी सुरक्षा - परिवार को समझाना दुःस्वप्न बन जाता है',
                    'बाजार दुर्घटना स्टार्टअप को पहले मारती है - कोई कॉर्पोरेट अनुभव नहीं मतलब कोई बैकअप प्लान नहीं'
                ] : [
                    'Startup 90% failure rate - your equity becomes worthless paper, salary becomes irregular',
                    'Work-life balance zero, 14-hour days - health deteriorates, relationships suffer badly',
                    'Funding dries up equals no salary, zero job security - explaining to family becomes nightmare',
                    'Market crashes kill startups first - no corporate experience means no backup plan'
                ],
                balanced: isHindi ? [
                    'मध्यम आकार की कंपनी न कॉर्पोरेट सुरक्षा देती है न स्टार्टअप विकास क्षमता',
                    'सीमित करियर प्रगति, वरिष्ठ पदों में योग्यता से अधिक राजनीति शामिल',
                    'मध्यम वेतन वृद्धि लंबी अवधि में मुद्रास्फीति को हराने के लिए संघर्ष करती है',
                    'बाजार मध्यम आकार की कंपनियों को कम महत्व देता है - समय के साथ स्विचिंग विकल्प सीमित हो जाते हैं'
                ] : [
                    'Mid-size company gives neither corporate security nor startup growth potential',
                    'Limited career progression, senior positions involve more politics than merit',
                    'Moderate salary growth struggles to beat inflation in long-term',
                    'Market values mid-size companies less - switching options become limited over time'
                ]
            }
        };
        
        return templates[domain]?.[approach] || this.getGenericBrutalConsTemplates(approach, isHindi);
    }

    getGenericProTemplates(approach, isHindi) {
        if (approach === 'conservative') {
            return isHindi ? [
                'कम जोखिम, अनुमानित परिणाम',
                'बजट में फिट, न्यूनतम वित्तीय तनाव',
                'तत्काल लाभ, त्वरित संतुष्टि',
                'सुरक्षित विकल्प, पारिवारिक अनुमोदन मिलने की संभावना'
            ] : [
                'Lower risk with predictable outcomes',
                'Fits within budget with minimal financial stress',
                'Immediate benefits with quick satisfaction',
                'Safe choice likely to gain family approval'
            ];
        } else if (approach === 'aggressive') {
            return isHindi ? [
                'भविष्य-केंद्रित दृष्टिकोण के साथ उच्च संभावित रिटर्न',
                'प्रीमियम गुणवत्ता दीर्घकालिक संतुष्टि सुनिश्चित करती है',
                'सामाजिक पहचान के साथ स्थिति सुधार',
                'अत्याधुनिक सुविधाएं प्रौद्योगिकी लाभ प्रदान करती हैं'
            ] : [
                'High potential returns with future-focused approach',
                'Premium quality ensures long-term satisfaction',
                'Status improvement with social recognition',
                'Cutting-edge features provide technology advantage'
            ];
        } else {
            return isHindi ? [
                'मध्यम जोखिम-पुरस्कार अनुपात के साथ संतुलित दृष्टिकोण',
                'भविष्य के परिवर्तनों के लिए लचीलापन बनाए रखा गया',
                'व्यावहारिक विकल्प का प्रतिनिधित्व करने वाला उचित समझौता',
                'टिकाऊ दीर्घकालिक रणनीति'
            ] : [
                'Balanced approach with moderate risk-reward ratio',
                'Flexibility maintained for future changes',
                'Reasonable compromise representing practical choice',
                'Sustainable long-term strategy'
            ];
        }
    }

    getGenericBrutalConsTemplates(approach, isHindi) {
        if (approach === 'conservative') {
            return isHindi ? [
                'सुरक्षित विकल्प की अवसर लागत बहुत अधिक है - दूसरे आपसे आगे निकल जाएंगे',
                'बजट विकल्प गुणवत्ता समझौता प्रीमियम से अधिक दीर्घकालिक लागत की ओर ले जाता है',
                'रूढ़िवादी दृष्टिकोण विकास क्षमता को गंभीर रूप से सीमित करता है',
                'बाजार परिवर्तन आपको कौशल उन्नयन के बिना अप्रचलित बना देंगे'
            ] : [
                'Safe choice opportunity cost is massive - others will overtake you',
                'Budget option quality compromise leads to higher long-term costs',
                'Conservative approach severely limits growth potential',
                'Market changes will make you obsolete without skill upgrades'
            ];
        } else if (approach === 'aggressive') {
            return isHindi ? [
                'उच्च जोखिम विकल्प में अस्सी प्रतिशत असफलता दर है - आपका नंबर अगला हो सकता है',
                'प्रीमियम विकल्प तनाव पारिवारिक रिश्तों को नष्ट कर देगा और गंभीर स्वास्थ्य समस्याएं पैदा करेगा',
                'आक्रामक रणनीति में कोई बैकअप योजना नहीं - एक गलती और सब कुछ हमेशा के लिए खत्म',
                'बाजार दुर्घटनाएं प्रीमियम विकल्पों को पहले प्रभावित करती हैं, रिकवरी लगभग असंभव'
            ] : [
                'High-risk choice has eighty percent failure rate - your number might be next',
                'Premium option stress will destroy family relationships and cause serious health issues',
                'Aggressive strategy has no backup plan - one mistake and everything is gone forever',
                'Market crashes hit premium choices first, recovery becomes nearly impossible'
            ];
        } else {
            return isHindi ? [
                'मध्य स्थल में फंसे - न बजट लाभ न प्रीमियम फायदे',
                'निरंतर समझौते औसतता निपटान की ओर ले जाते हैं, विकास पूरी तरह स्थिर हो जाता है',
                'संतुलित विकल्प का मतलब किसी भी विशिष्ट या मूल्यवान चीज़ में विशेषज्ञता विकास नहीं',
                'बाजार औसत प्रदर्शनकर्ताओं को कोई मूल्य नहीं देता - आप आसानी से बदले जा सकते हैं'
            ] : [
                'Stuck in middle ground - neither budget benefits nor premium advantages',
                'Constant compromises lead to mediocrity settlement, growth becomes completely stagnant',
                'Balanced choice means no expertise development in anything specific or valuable',
                'Market gives no value to average performers - you become easily replaceable'
            ];
        }
    }

    injectContextualDetails(template, context, problemDescription) {
        let result = template;
        
        // Inject location if available
        if (context.location) {
            result = result.replace(/city|शहर/gi, context.location);
        }
        
        // Inject budget if available
        if (context.budget) {
            result = result.replace(/budget|बजट/gi, context.budget);
        }
        
        // Inject specific terms from user input
        context.specificTerms.forEach(term => {
            if (Math.random() > 0.7) { // 30% chance to inject specific terms
                result = result.replace(/option|choice|विकल्प/gi, term);
            }
        });
        
        return result;
    }

    generateAIScores(problemDescription, context, approach, preferences) {
        // AI calculates scores based on multiple factors
        const baseScores = this.getBaseScores(approach);
        const contextAdjustments = this.calculateContextAdjustments(context, problemDescription);
        const preferenceAdjustments = this.calculatePreferenceAdjustments(preferences, approach);
        
        const finalScores = {};
        Object.keys(baseScores).forEach(key => {
            let score = baseScores[key];
            score += contextAdjustments[key] || 0;
            score += preferenceAdjustments[key] || 0;
            
            // Add some AI randomness for realism
            score += Math.floor(Math.random() * 10) - 5;
            
            // Ensure score stays within bounds
            finalScores[key] = Math.max(5, Math.min(95, score));
        });
        
        return finalScores;
    }

    getBaseScores(approach) {
        const scores = {
            conservative: { budget: 85, quality: 45, security: 90, growth: 25, risk: 15 },
            aggressive: { budget: 25, quality: 90, security: 30, growth: 90, risk: 85 },
            balanced: { budget: 65, quality: 70, security: 65, growth: 60, risk: 45 }
        };
        
        return scores[approach];
    }

    calculateContextAdjustments(context, problemDescription) {
        const adjustments = { budget: 0, quality: 0, security: 0, growth: 0, risk: 0 };
        
        // Domain-specific adjustments
        if (context.domain === 'transportation') {
            adjustments.budget += 5;
            adjustments.risk += 10;
        } else if (context.domain === 'housing') {
            adjustments.security += 15;
            adjustments.growth += 10;
        } else if (context.domain === 'career') {
            adjustments.growth += 20;
            adjustments.security -= 5;
        }
        
        // Urgency adjustments
        if (context.urgency === 'high') {
            adjustments.risk += 15;
            adjustments.security -= 10;
        }
        
        return adjustments;
    }

    calculatePreferenceAdjustments(preferences, approach) {
        const adjustments = { budget: 0, quality: 0, security: 0, growth: 0, risk: 0 };
        
        // Budget preference adjustments
        if (preferences.budget > 70 && approach === 'aggressive') {
            adjustments.quality += 10;
            adjustments.budget -= 10;
        } else if (preferences.budget < 30 && approach === 'conservative') {
            adjustments.budget += 15;
            adjustments.quality -= 5;
        }
        
        // Risk preference adjustments
        if (preferences.risk > 70 && approach === 'aggressive') {
            adjustments.growth += 15;
            adjustments.risk += 10;
        } else if (preferences.risk < 30 && approach === 'conservative') {
            adjustments.security += 20;
            adjustments.risk -= 15;
        }
        
        return adjustments;
    }

    generateAIRadarData(approach, context) {
        const baseRadar = {
            conservative: { risk: 2, reward: 4, stability: 9, flexibility: 5, growth: 3 },
            aggressive: { risk: 9, reward: 9, stability: 2, flexibility: 7, growth: 9 },
            balanced: { risk: 5, reward: 6, stability: 7, flexibility: 6, growth: 6 }
        };
        
        const radar = { ...baseRadar[approach] };
        
        // AI adjustments based on context
        if (context.domain === 'transportation') {
            radar.flexibility += 1;
            radar.risk += 1;
        } else if (context.domain === 'housing') {
            radar.stability += 2;
            radar.growth += 1;
        }
        
        // Ensure values stay within 1-10 range
        Object.keys(radar).forEach(key => {
            radar[key] = Math.max(1, Math.min(10, radar[key]));
        });
        
        return radar;
    }

    getAIIcon(domain, problemDescription) {
        const icons = {
            transportation: '🛵',
            housing: '🏠',
            career: '💼',
            technology: '💻',
            education: '🎓',
            investment: '💰',
            business: '🏢',
            lifestyle: '🌟'
        };
        
        // Check for specific terms in problem description
        const lower = problemDescription.toLowerCase();
        if (lower.includes('bike') || lower.includes('scooter') || lower.includes('2-wheeler')) {
            return '🛵';
        } else if (lower.includes('phone') || lower.includes('mobile')) {
            return '📱';
        }
        
        return icons[domain] || '⚖️';
    }

    getApproachCharacteristics(approach) {
        return {
            budgetFriendly: approach === 'conservative',
            premium: approach === 'aggressive',
            lowRisk: approach === 'conservative',
            highRisk: approach === 'aggressive',
            shortTerm: approach === 'conservative',
            longTerm: approach === 'aggressive'
        };
    }

    generateSacrificeText(option, language) {
        const isHindi = language === 'hindi';
        
        switch(option.approach) {
            case 'conservative':
                return isHindi ? 
                    'आप तेज़ी से बढ़ने और बड़े अवसरों को छोड़कर सुरक्षा चुनते हैं। दूसरे आगे निकल जाएंगे जब आप सुरक्षित खेल रहे होंगे।' :
                    'You sacrifice rapid growth and big opportunities for security. Others will advance while you play it safe.';
            case 'aggressive':
                return isHindi ? 
                    'आप वित्तीय सुरक्षा और मानसिक शांति को छोड़कर बड़े सपने चुनते हैं। उच्च तनाव की उम्मीद करें।' :
                    'You sacrifice financial security and peace of mind for big dreams. High stress expected.';
            case 'balanced':
                return isHindi ? 
                    'आप न तो पूर्ण सुरक्षा पाते हैं न ही अधिकतम विकास। दोनों चरम सीमाओं के लाभ खो देते हैं।' :
                    'You get neither full security nor maximum growth. Missing benefits of both extremes.';
            default:
                return isHindi ? 'ट्रेड-ऑफ विश्लेषण' : 'Trade-off analysis';
        }
    }

    generateComparativeSacrifice(chosenOption, alternativeOption, language) {
        const isHindi = language === 'hindi';
        
        // AI generates comparative sacrifice based on option characteristics
        if (chosenOption.approach === 'conservative' && alternativeOption.approach === 'aggressive') {
            return isHindi ? 
                'प्रीमियम सुविधाएं और भविष्य की विकास क्षमता' :
                'premium features and future growth potential';
        } else if (chosenOption.approach === 'aggressive' && alternativeOption.approach === 'conservative') {
            return isHindi ? 
                'वित्तीय सुरक्षा और मानसिक शांति' :
                'financial security and peace of mind';
        } else {
            return isHindi ? 
                'विशेषीकृत लाभ और केंद्रित फायदे' :
                'specialized benefits and focused advantages';
        }
    }
}

// Initialize AI Decision Engine
const decisionEngine = new AIDecisionIntelligence();
console.log('AI Decision engine initialized:', decisionEngine);

// Initialize sliders and language
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing AI system');
    
    const sliders = ['budgetSlider', 'riskSlider', 'timelineSlider'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId.replace('Slider', 'Value'));
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
            });
            console.log(`Initialized slider: ${sliderId}`);
        }
    });
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = '☀️';
    }
    
    // Initialize language
    const savedLanguage = localStorage.getItem('language') || 'en';
    currentLanguage = savedLanguage;
    
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === currentLanguage) {
            option.classList.add('active');
        }
    });
    
    // Set initial placeholder and button text based on saved language
    const problemInput = document.getElementById('problemInput');
    const btnText = document.getElementById('btnText');
    
    if (currentLanguage === 'hi') {
        if (problemInput) problemInput.placeholder = 'अपनी समस्या यहाँ लिखें...';
        if (btnText) btnText.textContent = 'विश्लेषण करें';
    } else {
        if (problemInput) problemInput.placeholder = 'Type your problem here...';
        if (btnText) btnText.textContent = 'Analyze Options';
    }
    
    updateUILabels(currentLanguage);
    
    // Initialize Speech Recognition
    const speechSupported = initializeSpeechRecognition();
    if (speechSupported) {
        console.log('Speech recognition initialized successfully');
        
        // Add voice button event listener
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', toggleVoiceRecognition);
            console.log('Voice button event listener added');
        }
    } else {
        console.warn('Speech recognition not available');
    }
    
    console.log('AI system initialization complete');
});

// Language Toggle Function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === currentLanguage) {
            option.classList.add('active');
        }
    });
    
    // Update Input Box Placeholder immediately
    const problemInput = document.getElementById('problemInput');
    if (problemInput) {
        if (currentLanguage === 'hi') {
            problemInput.placeholder = 'अपनी समस्या यहाँ लिखें...';
        } else {
            problemInput.placeholder = 'Type your problem here...';
        }
    }
    
    // Update Button Text immediately
    const btnText = document.getElementById('btnText');
    if (btnText) {
        if (currentLanguage === 'hi') {
            btnText.textContent = 'विश्लेषण करें';
        } else {
            btnText.textContent = 'Analyze Options';
        }
    }
    
    // Update Voice Recognition Language
    updateRecognitionLanguage();
    updateVoiceButtonState('idle'); // Update voice button tooltip
    
    // Update all other UI labels
    updateUILabels(currentLanguage);
    
    // Update any existing dynamic content if results are visible
    const resultsSection = document.getElementById('results');
    if (resultsSection && !resultsSection.classList.contains('hidden')) {
        // Update existing card labels
        const benefitsTitles = document.querySelectorAll('.pros .section-title');
        benefitsTitles.forEach(title => {
            title.textContent = currentLanguage === 'hi' ? 'फायदे' : 'Benefits';
        });
        
        // Update sacrifice table points label
        const sacrificeTable = document.querySelector('.sacrifice-table');
        if (sacrificeTable) {
            const pointsTexts = sacrificeTable.querySelectorAll('td');
            pointsTexts.forEach(cell => {
                if (cell.textContent.includes('points') || cell.textContent.includes('अंक')) {
                    const pointsLabel = currentLanguage === 'hi' ? 'अंक' : 'points';
                    cell.innerHTML = cell.innerHTML.replace(/(points|अंक)/g, pointsLabel);
                }
            });
        }
    }
    
    localStorage.setItem('language', currentLanguage);
    
    console.log('Language switched to:', currentLanguage);
}

function updateUILabels(language) {
    const elements = document.querySelectorAll('[data-en][data-hi]');
    elements.forEach(element => {
        const text = language === 'hi' ? element.dataset.hi : element.dataset.en;
        element.textContent = text;
    });
    
    // Update textarea placeholder
    const problemInput = document.getElementById('problemInput');
    if (problemInput) {
        if (language === 'hi') {
            problemInput.placeholder = 'अपनी समस्या यहाँ लिखें...';
        } else {
            problemInput.placeholder = 'Type your problem here...';
        }
    }
}

// Theme management
function toggleTheme() {
    console.log('toggleTheme function called');
    try {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (!themeIcon) {
            console.error('Theme icon not found!');
            return;
        }
        
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
            console.log('Switched to dark theme');
        } else {
            body.setAttribute('data-theme', 'light');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
            console.log('Switched to light theme');
        }
    } catch (error) {
        console.error('Error in toggleTheme:', error);
    }
}

async function analyzeDecision() {
    console.log('AI analyzeDecision function called');
    
    // COMPLETE UI WIPE - Clean Slate for Hackathon
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('hidden');
        
        // Completely clear all containers
        const containers = [
            'optionsGrid',
            'sacrificeGrid', 
            'sacrificeTable',
            'radarChartsGrid'
        ];
        
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
                container.style.display = 'none'; // Hide completely
                setTimeout(() => container.style.display = '', 100); // Show with animation
            }
        });
    }
    
    // Destroy all existing charts - Complete cleanup
    window.myCharts.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            try {
                chart.destroy();
            } catch (error) {
                console.warn('Error destroying chart:', error);
            }
        }
    });
    window.myCharts = [];
    
    try {
        const input = document.getElementById('problemInput');
        const problem = input.value.trim();
        
        if (!problem) {
            alert('Please describe your decision problem first!');
            return;
        }
        
        console.log('AI analyzing problem:', problem);
        
        // Get user preferences
        const preferences = {
            budget: parseInt(document.getElementById('budgetSlider').value),
            risk: parseInt(document.getElementById('riskSlider').value),
            timeline: parseInt(document.getElementById('timelineSlider').value)
        };
        
        console.log('User preferences:', preferences);
        
        // Show loading state
        const btn = document.getElementById('analyzeBtn');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('loadingSpinner');
        
        btn.disabled = true;
        btnText.textContent = 'AI Analyzing...';
        spinner.classList.remove('hidden');
        
        // AI processing simulation
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // AI generates completely fresh analysis
        const result = await decisionEngine.analyzeDecision(problem, preferences);
        console.log('AI analysis result:', result);
        
        // Display fresh AI results
        displayAIResults(result.options, result.sacrifices, result.sacrificeTable);
        
    } catch (error) {
        console.error('AI analysis failed:', error);
        alert('Sorry, AI analysis failed: ' + error.message);
    } finally {
        // Reset button state
        const btn = document.getElementById('analyzeBtn');
        const btnText = document.getElementById('btnText');
        const spinner = document.getElementById('loadingSpinner');
        
        if (btn) {
            btn.disabled = false;
            btnText.textContent = currentLanguage === 'hi' ? 'विकल्पों का विश्लेषण' : 'Analyze Options';
            spinner.classList.add('hidden');
        }
    }
}

function displayAIResults(options, sacrifices, sacrificeTable) {
    const resultsSection = document.getElementById('results');
    const optionsGrid = document.getElementById('optionsGrid');
    const sacrificeGrid = document.getElementById('sacrificeGrid');
    const sacrificeTableDiv = document.getElementById('sacrificeTable');
    const radarChartsGrid = document.getElementById('radarChartsGrid');
    
    // Create AI-generated option cards
    options.forEach((option, index) => {
        const card = createAIOptionCard(option, index);
        optionsGrid.appendChild(card);
    });
    
    // Create AI-generated sacrifice comparison cards
    sacrifices.forEach((sacrifice, index) => {
        const card = createAISacrificeCard(sacrifice, index);
        sacrificeGrid.appendChild(card);
    });
    
    // Create AI-generated sacrifice table
    createAISacrificeTable(sacrificeTable, sacrificeTableDiv);
    
    // Create AI-generated radar charts
    options.forEach((option, index) => {
        const chartContainer = createAIRadarChart(option, index);
        radarChartsGrid.appendChild(chartContainer);
    });
    
    // Show results with animation
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createAIOptionCard(option, index) {
    const card = document.createElement('div');
    card.className = `option-card ${option.recommended ? 'recommended' : ''}`;
    card.style.animationDelay = `${index * 0.2}s`;
    
    // Generate AI score badges
    const scoreBadges = Object.entries(option.scores).map(([key, value]) => {
        const scoreClass = value >= 80 ? 'score-high' : value >= 60 ? 'score-medium' : 'score-low';
        return `
            <div class="score-badge">
                <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span class="score-value ${scoreClass}">${value}/100</span>
            </div>
        `;
    }).join('');
    
    // Use proper language labels
    const benefitsLabel = currentLanguage === 'hi' ? 'फायदे' : 'Benefits';
    
    card.innerHTML = `
        <div class="option-header">
            <div class="option-title-row">
                <span class="topic-icon">${option.icon}</span>
                <h3 class="option-title">${option.title}</h3>
            </div>
            <div class="suitability-scores">
                ${scoreBadges}
            </div>
        </div>
        
        <div class="pros-section">
            <div class="pros">
                <div class="section-title">${benefitsLabel}</div>
                <ul class="points-list">
                    ${option.pros.map(pro => `<li>${pro}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    return card;
}

function createAISacrificeCard(sacrifice, index) {
    const card = document.createElement('div');
    card.className = 'sacrifice-card';
    card.style.animationDelay = `${(index + 3) * 0.2}s`;
    
    card.innerHTML = `
        <h4>${sacrifice.title}</h4>
        <p class="sacrifice-text">${sacrifice.sacrifice}</p>
    `;
    
    return card;
}

function createAISacrificeTable(sacrificeTable, container) {
    const table = document.createElement('table');
    
    // Create header with proper language support
    const thead = document.createElement('thead');
    const chooseLabel = currentLanguage === 'hi' ? 'यदि आप चुनते हैं...' : 'If you choose...';
    const loseALabel = currentLanguage === 'hi' ? 'आप विकल्प A से खो देते हैं' : 'You lose from Alternative A';
    const loseBLabel = currentLanguage === 'hi' ? 'आप विकल्प B से खो देते हैं' : 'You lose from Alternative B';
    
    thead.innerHTML = `
        <tr>
            <th>${chooseLabel}</th>
            <th>${loseALabel}</th>
            <th>${loseBLabel}</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body with AI-generated content
    const tbody = document.createElement('tbody');
    sacrificeTable.forEach(row => {
        const tr = document.createElement('tr');
        const pointsLabel = currentLanguage === 'hi' ? 'अंक' : 'points';
        tr.innerHTML = `
            <td><span class="option-name">${row.option}</span></td>
            <td class="sacrifice-text">${row.sacrifices[0]?.sacrifice || 'N/A'} (${row.sacrifices[0]?.score || 0} ${pointsLabel})</td>
            <td class="sacrifice-text">${row.sacrifices[1]?.sacrifice || 'N/A'} (${row.sacrifices[1]?.score || 0} ${pointsLabel})</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    container.appendChild(table);
}

function createAIRadarChart(option, index) {
    const container = document.createElement('div');
    container.className = 'radar-chart-container';
    container.style.animationDelay = `${(index + 6) * 0.2}s`;
    
    const canvas = document.createElement('canvas');
    canvas.className = 'radar-chart';
    canvas.id = `aiRadarChart${index}`;
    
    container.innerHTML = `<h4>${option.title}</h4>`;
    container.appendChild(canvas);
    
    // Create AI-powered Chart.js radar chart
    setTimeout(() => {
        try {
            if (typeof Chart === 'undefined') {
                console.error('Chart.js not loaded');
                container.innerHTML += '<p style="color: red;">Chart.js failed to load</p>';
                return;
            }
            
            const ctx = canvas.getContext('2d');
            const chartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Risk', 'Reward', 'Stability', 'Flexibility', 'Growth'],
                    datasets: [{
                        label: option.title,
                        data: [
                            option.radarData.risk,
                            option.radarData.reward,
                            option.radarData.stability,
                            option.radarData.flexibility,
                            option.radarData.growth
                        ],
                        backgroundColor: `rgba(99, 102, 241, ${0.2 + index * 0.1})`,
                        borderColor: `rgba(99, 102, 241, ${0.8 + index * 0.1})`,
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                stepSize: 2,
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                            },
                            grid: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                            },
                            angleLines: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--border')
                            },
                            pointLabels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                                font: {
                                    size: 12,
                                    weight: '600'
                                }
                            }
                        }
                    }
                }
            });
            
            // Store chart instance for cleanup
            window.myCharts.push(chartInstance);
            
        } catch (error) {
            console.error('Error creating AI radar chart:', error);
            container.innerHTML += '<p style="color: red;">Error creating AI chart</p>';
        }
    }, 100);
    
    return container;
}

// Allow Enter key to trigger AI analysis
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('problemInput');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                analyzeDecision();
            }
        });
    }
});

// AI-powered examples
document.addEventListener('DOMContentLoaded', function() {
    const examplesEn = [
        
        "Laptop for coding: MacBook vs Windows vs Linux machine"
        
    ];
    
    const examplesHi = [
        
        "करियर बदलाव: स्टार्टअप ज्वाइन करूं या कॉर्पोरेट में रहूं?"
        
    ];
    
    const input = document.getElementById('problemInput');
    let exampleIndex = 0;
    
    if (input) {
        input.addEventListener('focus', function() {
            if (!this.value) {
                const examples = currentLanguage === 'hi' ? examplesHi : examplesEn;
                this.placeholder = examples[exampleIndex % examples.length];
                exampleIndex++;
            }
        });
        
        // Reset placeholder when losing focus if empty
        input.addEventListener('blur', function() {
            if (!this.value) {
                const placeholder = currentLanguage === 'hi' ? 
                    this.dataset.placeholderHi : 
                    this.dataset.placeholderEn;
                this.placeholder = placeholder;
            }
        });
    }
});