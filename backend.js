const MongoClient = require("mongodb").MongoClient;
const url =
    "mongodb+srv://dickson:123@pplcountai-p9qbg.mongodb.net/test?retryWrites=true&w=majority";
let db;

//returns a promise. If connected then nothing is returned, or else an error is returned
function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true })
            .then((cluster) => {
                db = cluster.db("database");
                resolve();
            })
            .catch((err) => reject(err));
    });
}

function login(email, pass) {
    return new Promise((resolve, reject) => {
        db.collection("business_accounts").findOne(
            { emailAddress: email, pass: pass },
            function (err, result) {
                if (err || result === null) {
                    throw new Error("Login Failed");
                } else {
                    resolve(result);
                }
            }
        );
    });
}

function createBusinessAccount(
    email,
    pass,
    companyName,
    address,
    postalCode,
    maxNumberOfPeople,
    description
) {
    let businessObject = {
        emailAddress: email,
        pass: pass,
        companyName: companyName,
        address: address,
        postalCode: postalCode,
        maxNumberOfPeople: maxNumberOfPeople,
        description: description,
    };
    db.collection("business_accounts")
        .find({ emailAddress: email, pass: pass })
        .toArray(function (err, result) {
            if (err) {
                throw err;
            }

            if (result.length > 0) {
                throw new Error("Business already exists!");
            }
            db.collection("business_accounts").insertOne(
                businessObject,
                function (err, res) {
                    if (err) {
                        throw err;
                    }
                }
            );
        });
    return true;
}

function businessExists(email, pass) {
    return new Promise(function (resolve, reject) {
        db.collection("business_accounts")
            .find({ emailAddress: email, pass: pass })
            .toArray(function (err, result) {
                if (err) {
                    resolve(false);
                }
                if (result.length == 0) {
                    reject("Business doesn't exist!");
                }
                resolve(result);
            });
    });
}

function deleteBusinessAccount(email, pass) {
    businessExists(email, pass).then((result) => {
        db.collection("business_accounts").deleteOne(
            { emailAddress: email, pass: pass },
            function (err, obj) {
                if (err) {
                    throw err;
                }
            }
        );
    });
}

//allows company to change number of people in business
function updateNumberOfPeople(email, pass, numberOfPeople) {
    businessExists(email, pass).then((result) => {
        let newValues = { $set: { numberOfPeople: numberOfPeople } };
        db.collection("business_accounts").updateOne(
            { emailAddress: email, pass: pass },
            newValues,
            function (err, res) {
                if (err) {
                    throw err;
                }
            }
        );
    });
}

//allows company to increase number of people in business by one
function incrementNumberOfPeople(email, pass) {
    businessExists(email, pass).then((result) => {
        let num = result[0].numberOfPeople;

        let newValues = { $set: { numberOfPeople: num + 1 } };
        db.collection("business_accounts").updateOne(
            { emailAddress: email, pass: pass },
            newValues,
            function (err, res) {
                if (err) {
                    throw err;
                }
            }
        );
    });
}

//allows company to decrease number of people in business by one
function decrementNumberOfPeople(email, pass) {
    businessExists(email, pass).then((result) => {
        let num = result[0].numberOfPeople;

        let newValues = { $set: { numberOfPeople: num - 1 } };
        db.collection("business_accounts").updateOne(
            { emailAddress: email, pass: pass },
            newValues,
            function (err, res) {
                if (err) {
                    throw err;
                }
            }
        );
    });
}

//allows company to change number of people in business
function updateDescription(email, pass, description) {
    businessExists(email, pass).then((result) => {
        let newValues = { $set: { description: description } };
        db.collection("business_accounts").updateOne(
            { emailAddress: email, pass: pass },
            newValues,
            function (err, res) {
                if (err) {
                    throw err;
                }
            }
        );
    });
}

function returnArrayOfQueries(stringQuery) {
        let query = new RegExp(stringQuery, "i");
        return new Promise((resolve, reject) => {
            db.collection("business_accounts")
                .find(
                    {
                        companyName: {
                            $regex: query,
                        },
                    },
                    { projection: { emailAddress: 0, pass: 0 } }
                )
                .sort({ numberOfPeople: 1 })
                .toArray(function (err, result) {
                    if (err) {
                        reject("Failed Query");
                    } else {
                        resolve(result);
                    }
                });
        });
    }

// connect()
//     .then(() => {
//         login("hah@gmail.com", "r3q23rq");
//         console.log("Login success!");
//     })
//     .catch((err) => {
//         throw err;
//     });

/*
createBusinessAccount(
    "test@test.com",
    "password",
    "The Company",
    "123 Street",
    "ABC 123",
    100,
    "Very fun company"
);
*/
