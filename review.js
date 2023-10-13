document.getElementById('companyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const pros = document.getElementById('pros').value;
    const cons = document.getElementById('cons').value;
    const rating = document.getElementById('rating').value;
    addCompany(name, pros, cons, rating);
    displayAllDetails(); // After adding, display all details
});
document.getElementById('searchButton').addEventListener('click', function() {
    const companyName = document.getElementById('search').value;
    getCompanyDetails(companyName);
});

function addCompany(name, pros, cons, rating)
{
    let companyList = JSON.parse(localStorage.getItem('companyList')) || [];
    companyList.push({ name, pros, cons, rating: parseInt(rating) }); // Parse rating as an integer
    localStorage.setItem('companyList', JSON.stringify(companyList));
}

function getCompanyDetails(name)
{
    const companyList = JSON.parse(localStorage.getItem('companyList')) || [];
    const results = companyList.filter(company => company.name.toLowerCase() === name.toLowerCase());
    if (results.length > 0)
    {
        const totalRatings = results.reduce((sum, company) => sum + company.rating, 0);
        const averageRating = (totalRatings / results.length).toFixed(1);
        const output = results.map(result => {
            return `
                <li>
                    <strong>Company Name:</strong> ${result.name}<br>
                    <strong>Pros:</strong> ${result.pros}<br>
                    <strong>Cons:</strong> ${result.cons}<br>
                    <strong>Rating:</strong> ${'*'.repeat(result.rating)}
                </li>`;
        }).join('');
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history.push({ name, details: output, averageRating });
        localStorage.setItem('searchHistory', JSON.stringify(history));
        document.getElementById('result').innerHTML = `<ul>${output}</ul><p>Average Rating: ${averageRating}</p>`;
        displaySearchHistory();
    }
    else
    {
        document.getElementById('result').innerHTML = "Company not found.";
    }
}

function displaySearchHistory()
{
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyList = history.map(item => {
        return `
            <li>
                <strong>Company Name:</strong> ${item.name}<br>
                <strong>Details:</strong><br>${item.details}
            </li> `;
    }).join('');
    document.getElementById('searchHistory').innerHTML = `<ul>${historyList}</ul>`;
}

function calculateAverageRating(companyList, companyName)
{
    const ratings = companyList.filter(company => company.name.toLowerCase() === companyName.toLowerCase()).map(company => company.rating);
    if (ratings.length === 0)
    {
        return "No ratings available";
    }
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    const average = Math.min(5, Math.max(1, Math.round(totalRating / ratings.length)));
    return average;
}


