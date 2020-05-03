const MongoClient = require("mongodb").MongoClient;
const url =
    "mongodb+srv://dickson:123@pplcountai-p9qbg.mongodb.net/test?retryWrites=true&w=majority";
let db;

module.exports = {
    //returns a promise. If connected then nothing is returned, or else an error is returned
    connect: function () {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true })
                .then((cluster) => {
                    db = cluster.db("database");
                    resolve();
                })
                .catch((err) => reject(err));
        });
    },

    login: function (email, pass) {
        return new Promise((resolve, reject) => {
            db.collection("business_accounts").findOne(
                { emailAddress: email, pass: pass },
                function (err, result) {
                    if (err || result === null) {
                        reject("Login Failed");
                    } else {
                        console.log("success");
                        resolve(result);
                    }
                }
            );
        });
    },

    companyList: function (stringQuery) {
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
    },

    createBusinessAccount: function (
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
            numberOfPeople: 0,
        };
        return new Promise((resolve, reject) => {
            db.collection("business_accounts")
                .find({ emailAddress: email, pass: pass })
                .toArray(function (err, result) {
                    if (err) {
                        reject(err);
                    }

                    if (result.length > 0) {
                        reject("Business already exists!");
                    }
                    db.collection("business_accounts").insertOne(
                        businessObject,
                        function (err, res) {
                            if (err) {
                                reject(err);
                            }
                            resolve(res);
                        }
                    );
                });
        });
    },

    businessExists: function (email, pass) {
        return new Promise(function (resolve, reject) {
            db.collection("business_accounts")
                .find({ emailAddress: email, pass: pass })
                .toArray(function (err, result) {
                    if (err) {
                        resolve("Error!");
                    }
                    if (result.length == 0) {
                        reject("Business doesn't exist!");
                    }
                    resolve(result);
                });
        });
    },

    deleteBusinessAccount: function (email, pass) {
        return new Promise((resolve, reject) => {
            businessExists(email, pass)
                .then((result) => {
                    db.collection("business_accounts").deleteOne(
                        { emailAddress: email, pass: pass },
                        function (err, obj) {
                            if (err) {
                                reject(err);
                            }
                            resolve(obj);
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    },

    //allows company to change number of people in business
    updateNumberOfPeople: function (email, pass, numberOfPeople) {
        return new Promise((resolve, reject) => {
            businessExists(email, pass)
                .then((result) => {
                    let newValues = {
                        $set: { numberOfPeople: numberOfPeople },
                    };
                    db.collection("business_accounts").updateOne(
                        { emailAddress: email, pass: pass },
                        newValues,
                        function (err, res) {
                            if (err) {
                                reject(err);
                            }
                            resolve(res);
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    },

    //allows company to increase number of people in business by one
    incrementNumberOfPeople: function (email, pass) {
        return new Promise((resolve, reject) => {
            businessExists(email, pass)
                .then((result) => {
                    let num = result[0].numberOfPeople;

                    let newValues = { $set: { numberOfPeople: num + 1 } };
                    db.collection("business_accounts").updateOne(
                        { emailAddress: email, pass: pass },
                        newValues,
                        function (err, res) {
                            if (err) {
                                reject(err);
                            }
                            resolve(res);
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    },

    //allows company to decrease number of people in business by one
    decrementNumberOfPeople: function (email, pass) {
        return new Promise((resolve, reject) => {
            businessExists(email, pass)
                .then((result) => {
                    let num = result[0].numberOfPeople;

                    let newValues = { $set: { numberOfPeople: num - 1 } };
                    db.collection("business_accounts").updateOne(
                        { emailAddress: email, pass: pass },
                        newValues,
                        function (err, res) {
                            if (err) {
                                reject(err);
                            }
                            resolve(res);
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    },

    //allows company to change number of people in business
    updateDescription: function (email, pass, description) {
        return new Promise((resolve, reject) => {
            businessExists(email, pass)
                .then((result) => {
                    let newValues = { $set: { description: description } };
                    db.collection("business_accounts").updateOne(
                        { emailAddress: email, pass: pass },
                        newValues,
                        function (err, res) {
                            if (err) {
                                reject(err);
                            }
                            resolve(res);
                        }
                    );
                })
                .catch((err) => reject(err));
        });
    },
};

// module.exports
//     .connect()
//     .then(() =>
//         module.exports.createBusinessAccount(
//             "test@test.com",
//             "password",
//             "The Company",
//             "123 Street",
//             "ABC 123",
//             100,
//             "Very fun company"
//         )
//     )
//     .then((result) => console.log(result))
//     .catch((err) => {
//         console.log("Error!");
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
