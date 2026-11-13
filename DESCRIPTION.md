# HGPS (Hobby Gold Prospecting Switzerland)

This is a Project about Gold Prospecting in Switzerland. Mapping spots, share findings, feedbacks.
Beginner and advance Guides and Regulation in swizerland.
Sponsor or Partnership with gold outdoor shops/courses.



# OBJECTIFS

## Map gold presence in swizerland (focus on Bern)
The Map page gives the user the possibility to see all Public spots but also all private spots.
There is also a possibility to see other users public spots. To see another user spots you need to be able to search for the User.
You can also add a user to a favorite list.





## User Account
Each User can add there own spots, make them Private or Public (to share with others).




## Gold Spots
A spot is a zone defined by a User. Each Spot has a name, description, gold presence info, a status (public or private).
Also a spot can have pictures to illustrate findings.
A gold spot is a zone that can be created, updated, deleted by user that created the Zone.


## Guide
The Application also has a Guide that descripts multiple things, illustrated with Pictures/Drawings :
 - Where to Find gold in a creek
 - Gold deposition in a creek
 - How to find gold 
 - Where the Gold comes from (Placer or Glacial Gold), from the Mountains, quartzt veines erotion, Gold mines dumps, galcial activities.
 - Gold Detecting 


## Regulation
Swizerland has Strong regulation where and when to find gold. Not all material is allowed to be used.
And each Kanton has their own regulation, which can even be overridden by a regulation defined by a city.

 - Regulation by Kanton
 - Good practices to keep the Hobby Legal and safe


## Forum ? 
A forum to share experiences and find groups/events to go gold prospecting.
--> needs to be analyzed, legal limitation and forum moderation is legally required ?


# Authentification
Each User can create an account and login to add their own spots.


# Header

# Pages
- Home (like a landing page)
  - Presentation of the app
  - 
- Map
  - Header Filter (Collapsible) -> filter on users to see spots, filter spots by gold presence ?
  - Map with the spots
- Guide
- Regulation







# Technologies
- Quarkus
- PostgreSQL
- Quinoa
- Lit
- Keyckloak
- S3 something ? 




# TODOS (things to implement)
- Map needs to a header that will give the possibility to filter the areas I want to see.
- Add tables in the database
  - User, friends, parameters, areas, friend requests 
- Add a login system with keycloak
  - Able to login as a guest (default ?) --> should the main page be the landing page, visite the site in read only mode by default ?
  Header should have in big, Create account or login to unlock full functionality. 
  - Able to create account, login/logout 
- API's with permissions
  - User search
  - User Parameters
  - Add/Alter/Delete Areas
  - Friend Requests
- Load data from the API
  - Users Search, Areas of friends
- Front add color themes
- Front add map themes if possible ?
- Front add Filters on the map Like by Kanton etc...
- When adding a new Area, also add a Kanton to it automatically, also Make it possible to have multiple kanton
- Side Menu, bottom add contact link and a legal information

- Landing Page
I want for the Home page I want something like a landing page. Different cards with text, linked between not with an arrows but with like a svg sort of creek flow.
The link should be a representation of the water flow, like a waterfall. You can make it with svg or I could look if I find a Picture if that would be better.

Card 1 : Title : Gold Prospecting, description : what gold prospecting is, why it's fun/interessting
Card 2 : Title : Modern gold Prospecting tool, description : difficulty to have a clear visual of gold bearing spots and prospecting spots
Card 3 : Tilte : A Map for visualization, description : A map with a set of visual tools to locate the best spots 
Card 4 : Title : A Guide for Beginner and more.., description : A prospecting guide for findings spots, gold panning and gold detection
Card 5 : Title : Legal limitation, description : Legal aspect and preservation of nature, keep the gold prospecting hobby legal and clean.

(feel free to elaborate but not more than 5 paragraphs, keep it simple. Feel free to make better titles.)

Visually like this format :

------------
Texte Title |
Description |
-------------
    |
    |         ------------
     -------- |Text Title |
              |description|
              ------------
                  |
-----------       |
Texte Title| -------
Description| 
------------

make the river be more like
          |
          |        
          -------->

Don't show too much river bank 



- Guide 
  - Finish Guide with description (description should have translation)
  - Add Guide for metal detecting

- Rules
  - Add legal rules by Kanton


- For Fun, add a mini-game / test ?



