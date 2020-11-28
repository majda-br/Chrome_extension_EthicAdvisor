const API_URL = 'https://api.ethicadvisor.org'; 
const SEARCH_INDEX = 21;

async login() { 
    try { 
        const response = await fetch(`${API_URL}/api/user/login`, { 
            method: 'POST', 
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                email: this.state.email,
                password: this.state.password, 
                platform: 'app', 
                include_scans: true, 
                index_suffix: SEARCH_INDEX   
            }), 
            credentials: 'include'
        }); 
        /* Print du status pour DEBUG */ 
        console.log(`=====> RESPONSE STATUS: ${response.status}`); 

        if (response.status === 200) { 
            try {   
                /* On récupère les infos existantes */ 
                const user = await response.json
                } catch (err) { 
                    /* Pop-up générée */
                    Alert.alert("L'email ou le mot de passe est invalide"); 
                    trackError('Login error: ' + err); 
                } 
        } else if (response.status === 401) { 
            Alert.alert("L'email ou le mot de passe est invalide"); 
        } else { 
            Alert.alert( 'Une erreur est survenue... merci de réessayer dans quelques minutes ou de nous contacter à contact@ethicadvisor.fr');
            const text = await response.text();     
            trackError('Login error: ' + response.status + ' ' + text); 
        } 
        } catch (err) { 
            Alert.alert("L'email ou le mot de passe est invalide"); 
            trackError('Login error: ' + err); 
        }
}