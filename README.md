### Please feel free to test out the site using username: test@test.com password: test

# Portfolio Tracker

https://github.com/parkshub/portfolio-tracker-part-2/assets/87814883/ebbc9023-a202-4d46-9fc4-bf79e76a3e54

## Introduction

#### This web application keeps track of your cryptocurrency portfolio. The decision to use cryptocurrencies rather than stocks was due to its more readily available and well-documented APIs. On the Browse page, users can browse through the top 100 coins presented on a table with information on the asset’s name, ticker, market capitalization, current price, and 24-hour price activity. Upon clicking on one of the coins, the user will be taken to the respective coin’s profile page. Here, the users can track the price action of the coin through a line graph, which can be switched to a daily, monthly, or yearly graph. Furthermore, users can record their “buy” and “sell” transactions for that coin. All past transactions are displayed in the table below. When recording transactions, users can choose to use the price recommended by the application for that date or manually input the price.

#### In the Profile page, users are given basic statistics on their portfolio—dollar valuation, daily percentage change, total allocation, and net profit. Similar to the line graph on the Coin page, users can track their portfolio on a line graph that can also be viewed on a daily, monthly, or yearly basis. They’re also given a pie graph with each slice representing an asset’s relative total allocation in their portfolio. Users can see all their previous transactions at the bottom of the Profile page and filter by asset name. Clicking a transaction will take the user to the respective coin’s page. The user can delete any transactions they’ve made on either the Coin or Profile page.

#### URL: https://crypto-portfolio-tracker-61f20615e34f.herokuapp.com

## Lessons Learned and Optimizations

#### The Coin and Profile pages all have a line graph that displays the price actions on a daily, monthly, and yearly basis. Data wrangling was done using basic Node.js. Although manageable, using a package that allowed me to manipulate large amounts of data, like Pandas and NumPy from Python, would have been much more efficient.

#### For the Browse page, a search bar dynamically changes the table depending on what the user types. To do this, I needed to save Redux’s store value “coin” into a React state (“FilteredCoinState”). However, initializing the variables in the same useEffect made it so that “FilteredCoinState” was empty. Here, I realized the importance of “separation of concerns” for useEffect hooks. After inserting them into separate useEffect functions, I could properly initialize “FilteredCoinState.” 

#### On the Main page, there’s a line graph component and a carousel component, which displays the top 10 coins’ icons with their price and 24-hour price change on a moving carousel. As mentioned, the line graph contains buttons to switch the view from a daily, monthly, or yearly graph. Previously, when a user switched the line graph’s view, the carousel would reset. I fixed the issue by storing the carousel’s state in a cache using React’s memoized component. 

#### Another obstacle I faced was the call limit for Coingecko’s free API plan. If I exceeded my daily call limit or the server was particularly congested, my application would crash or have no data to show. As a solution, I implemented various workarounds. Each page’s data is gathered only once a day and stored in both the user’s local storage and a database. When a page is rendered, it first checks to see if the data in local storage is outdated, meaning it’s over a day old. It’ll use that data to render the page if it’s not outdated. If it is outdated, it’ll then check the database to see if the entry in the database is outdated. If it is not, it’ll update the local storage and render the page using the database’s entry. If they are both outdated, it’ll make an API call and update the local storage and database. This way, every user contributes to ensuring that the database contains the most recent information resulting in fewer API calls.

#### Lastly, I had set up my JWT to expire in 7 days. However, I hadn’t coded anything to handle when the token expired. As a result, the application would break when a token expired. Even if a user wasn’t logged in or had an expired token, I wanted to give the user access to all of the pages besides the Profile page with restricted access to the Coin page. On the Coin page, I wanted the users to see the price action and basic information about a coin but be restricted from recording “buy” and “sell” transactions, and their past transactions won’t be seen. I wrapped an asynchronous function inside a separate useEffect hook for these two pages as a solution. If a user were to attempt to access their Profile page with an expired token, they’d be logged out and redirected to the Main page with a message saying, “Token expired, please re-login. Redirecting to Main page.” However, if they accessed the Coin page with an expired token, they’d be logged out and given restricted access with a message saying, “Token expired, please login again to see and record transactions.”

## Future Aspirations

#### Due to the API call limit, I had to make several concessions—one being the fact that each page only updates the information on each page once a day and the other being the fact the Browse page’s coins only take you to either Bitcoin’s or Ethereum’s Coin page. This had to be done to prevent reaching the daily limit preemptively. Furthermore, suppose both the local storage and database’s data are outdated, and the API limit has been reached. In that case, pages will render outdated information using either of the most up-to-date information. With more API calls, creating a fully functional website where coin data is automatically and periodically updated and where users can freely browse every coin would have been great. Additionally, I would’ve liked the carousel on the Main page to update every minute to reflect the coins’ price changes. Lastly, I would have liked to handle JWT expiration at the App level instead of the page level. 


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

