I. Fichiers de l'extension
II. Etat du projet et améliorations futurs
III. Présentation du code et de sa structure 
IV. Mise en ligne de l'extension


I.Fichiers de l'extension : 
    - les fichiers en .png sont les images utilisées dans l'interface (logo EthicAdvisor)
    - 'manifest.json'
    - 'background.js'
    - 'content.js'
    - 'popup.js'
    - 'popup.html' 
    - 'sans_resultats.html'
    - 'popup.css' et 'sans_resultat.css' gèrent l'interface graphique pour respectivement la page principale de l'extension et la page où l'on ne trouve pas d'alternatives
    
    - 'identifiants.html' et 'identifiant.css' : ces deux fichiers gèrent l'interface graphique de la page de connexion
    - 'identifiant.js' doit gérer la fonctionnalité de connexion pour les utilisateurs, qui n'est pas encore opérationnelle


II. Etat du projet et améliorations futurs
Etat du projet : 
    Actuellement l'extension ne marche que pour Amazon en utilisant Chrome.
    L'extension comporte deux pages : 
        - Une correspondant au cas où un produit est identifié, on affiche alors 3 alternatives venant de la base de données d'EthicAdvisor et un call-to-action
        - Une pour le cas où aucun produit n'est identifié, on propose alors à l'utilisateur de le rediriger vers une sélection des produits d'EthicAdvisor ou qu'il nous contacte afin de nous partager d'autres alternatives
    Une troisième page est en préparation : la page de connexion par l'utilisateur. La partie interface graphique (codée en CSS) est prête, il manque la partie javascript qui exploite l'API d'EthicAdvisor.


Comment adapter l'extension à d'autres sites ?
    - La partie interface graphique n'a pas à être retouchée.
    - Il faut modifier le code permettant d'obtenir les infos du produit visité sur le site de e-commerce nous intéressant. ( Voir le fichier "content.js" ligne 7 à 22 dans le cas de Amazon ) 
    - Il faut réaliser un tableau de correspondance entre les catégories du site de e-commerce et celles d'EthicAdvisor (voir excel "Recensement catégorie Amazon_EA" pour exemple)
    - Implémenter cette correspondance dans le code javascript. (voir dans le fichier "background.js" le dictionnaire match_cat dans le cas de Amazon)


III. Présentation du code et de sa structure 
On a mis des commentaires quasiment à chaque ligne pour que ça soit plus simple à comprendre le code. 


0. Lien entre les fichiers 
manifest.json est un peu la carte d'identité de l'extension ( on y précise le nom, la version, le rôle des fichiers etc ... )
content.js ( content script )  <-> backgroud.js ( background script )  <-> popup.js ( popup ) 
Le content script ne peut pas communiquer directement avec popup.js, il doit forcément envoyer d'abord le message à background.js 
Le content script s'exécute automatiquement une seule fois quand on est sur une url contenue dans le dictionnaire "matches" définie dans manifest.json
Le background script est tout le temps en activation 
Popup.js s'active quand on clique sur l'icône 


1. Récupération des informations du produits quand on est sur Amazon 
Fichier concerné : content.js 
Dans notre cas, on a défini "matches" sur all_urls et c'est grâce à une condition if ( l.7 )  qu'on regarde si on est sur Amazon .
On récupère les infos voulues ( catégorie et ce qu'a écrit la personne sur la barre de recherche Amazon ) grâce à la fonction document.GetElementByTagName et document.getElementsByClassName (l.9-11)
On envoie les infos stockées dans le dictionnaire message grâce à la fonction chrome.runtime.sendMessage


2. Récupération des produits alternatifs 
Fichier concerné : background.js
La commande chrome.runtime.onMessage.addListener permet de recevoir l'information qu'envoie le content script. ( l.49 )
Elle est stockée dans request. 
Quand on recoit une information de la part du content script, on exécute une fonction: 
Si la catégorie récupérée est dans les clés du dictionnaire match_cat, alors on modifie la popup, l'icone et le badge (l.61-65). Puis on fait le lien entre la catégorie d'Amazon avec celle de EthicAdvisor et on récupère l'id associé (l.70). 
L'id nous permet alors de récupérer les 24 meilleurs produits alternatifs classés par ethiscore grâce à l'API d'EthicAdvisor searchProductsByCategory(categoryId). On met toutes ces informations dans window.ethic. (l.74-86) 
On peut en récupérer plus si on veut en changeant la valeur de la variable size dans la fonction searchProductsByCategory(categoryId). 
Sinon, on change la fenêtre popup ( celle sans produits ) , l'icône ( celle en gris ) et on enlève le badge. (l.92-96) 


3. Afficher les informations obtenues sur la page popup.html
On récupère nos informations ( window.ethic ) grâce à la chrome.extension.getBackgroundPage().ethic ( l-2 ) et on les stocke dans window.ethic
Puis la commande document.getElementByTd("nom_de_id").textContent = "ce qu'on souhaite afficher ", on peut mettre nos informations entre les balises où on a défini l'id
ex : <span id="name1"></span> dans le fichier popup.html. En écrivant document.getElementByTd("name1").textContent = "yoda" dans le fichier js, on aura alors "yoda" à l'emplacement de la balise. 
La source de la photo obtenue grâce à l'API est soit un nom de fichier jpeg ( "nom_de_la_photo".thumb.jpeg ) ou bien une url. Si c'est une url, il n'y a pas de problème, sinon il faut la remplacer par 'https://static.ethicadvisor.org/"nom_de_la_photo".carrousel.jpeg
Ainsi, la fonction changerImage(id, src) fait cette modification et change la source de la photo sur le fichier html ( document.getElementById(id).src = "source" ) 
Pour ce qui est de l'aléatoire, on choisit un nombre entier aléatoire r entre 1 et 10 ( fonction getRandomInt (l.40) ) et on affiche le produit r,r+1 et r+2. 


Alternatives : 
Si on ne détecte pas de catégorie adapté, on affiche la page sans_resultat.html accompagné de sans_resultat.css. 




IV. Mise en ligne de l'extension
Cette étape nécessite un compte développeur Google ainsi qu'un payement pour pouvoir publier (seulement pour la première publication).
L'utilisation du compte développeur utilisé pour l'application mobile devrait pouvoir éviter le payement.
Les étapes nécessaires sont très bien expliquées sur cette page : https://developer.chrome.com/webstore/publish
Si jamais vous avez un problème lors de la publication, vous pouvez nous contacter !