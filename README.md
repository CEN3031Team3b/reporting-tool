Part III: Updated GitHub ReadMe file (Submission: Update GitHub)

Please provide the following information in your ReadMe file

Link to the deployed page
Credit people/organizations you borrowed code from  or APIs you used - e.g., Bootstrap,  
List of all project features implemented and associated screenshots
include landing or home page
Instructions for how to run the project locally
How to update database and server connections

Website was not deployed for client privacy issues concerning Amazon Marketplace Web Services credentials access.

Developed with the use of:
	Amazon MWS-SDK (2013 version)

Landing Page:

[![Landing Page](http://i.imgur.com/sxUfVMB.jpg)]

Dashboard:
	Shows 4 vital informatics to the user upon first logging in.  A small view of the SKU/Brand report, Revenue during the time period saved to the user profile, Inventory (not accurate / functioning), and Return Rate (not accurate / functioning).

	Also note the threshold and time frame input fields near the top of the view.  This saves the time frame to the user's profile in the database.  All data displayed from this point forward will be from the time frame which the user has specified and saved to his profile.

[![Dashboard](http://i.imgur.com/1lWrBUQ.jpg)]


SKU Report:
	This shows important information about the seller's products over the time period which is saved to the users profile.  Aggregating over the time frame showing the quantity of each product sold, how much revenue it has brought in, etc.

[![SKU Report](http://meanjs.org/img/logo-small.png)]

Brand Report:
	This is another level of aggregation where the seller's products are grouped by the brand of the product.  Showing which brands are succeeding and meeting target margins, etc.

[![Brand Report](http://i.imgur.com/CK5hLNs.png)]

Account Settings:
	A simple collection of views which serve multiple functions, such as the view which allows users to enter their amazon credentials which are then stored in the user's model in the database.

[![Account Settings](http://i.imgur.com/eVjvWOy.png)]


To run the project locally one should clone the repository and run the following commands (with node js and all appropriate mean stack utilities installed)

'''
npm install
npm install mws-sdk
bower update
grunt
'''

<b> It is crucial that the user store their credentials in a local.js file located in the /config/env/ directory.</b>
The program does not currently take credentials from the database but a local js file because up until this point the product was developed for in-house use (see note about not having actual deployment).

