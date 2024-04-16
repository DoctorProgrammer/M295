const express = require('express');
const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const doc = {
    info: {
        version: "1.0.0",
        title: "Meine API",
        description: "Dokumentation meiner API"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: "Books",
            description: "Endpoints für Bücher"
        },
        {
            name: "Lends",
            description: "Endpoints für Ausleihen"
        }
    ],
    paths: {
        "/books": {
            "get": {
                "tags": ["Books"],
                "summary": "Gibt die Liste von allen Büchern als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Liste von Büchern"
                    }
                }
            },
            "post": {
                "tags": ["Books"],
                "summary": "Erstellt ein neues Buch in der Liste und gibt dasselbe Objekt wieder als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Neues Buch wurde erstellt"
                    }
                }
            }
        },
        "/books/{isbn}": {
            "get": {
                "tags": ["Books"],
                "summary": "Gibt alle Informationen zu einem Buch als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Informationen zu einem Buch"
                    }
                }
            },
            "put": {
                "tags": ["Books"],
                "summary": "Überschreibt das Buch in der Liste und gibt dasselbe Objekt wieder als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Buch wurde aktualisiert"
                    }
                }
            },
            "delete": {
                "tags": ["Books"],
                "summary": "Löscht das Buch in der Liste",
                "responses": {
                    "200": {
                        "description": "Buch wurde gelöscht"
                    }
                }
            },
            "patch": {
                "tags": ["Books"],
                "summary": "Ändert die Daten eines Buchs und gibt dasselbe aktualisierte Objekt wieder als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Buch wurde aktualisiert"
                    }
                }
            }
        },
        "/lends": {
            "get": {
                "tags": ["Lends"],
                "summary": "Gibt alle Ausleihen als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Liste von Ausleihen"
                    }
                }
            },
            "post": {
                "tags": ["Lends"],
                "summary": "Leiht ein neues Buch aus",
                "responses": {
                    "200": {
                        "description": "Buch wurde ausgeliehen"
                    }
                }
            }
        },
        "/lends/{id}": {
            "get": {
                "tags": ["Lends"],
                "summary": "Gibt alle Informationen zu einer Ausleihe als JSON zurück",
                "responses": {
                    "200": {
                        "description": "Informationen zu einer Ausleihe"
                    }
                }
            },
            "delete": {
                "tags": ["Lends"],
                "summary": "Bringt ein Buch zurück",
                "responses": {
                    "200": {
                        "description": "Buch wurde zurückgebracht"
                    }
                }
            },
            "patch": {
                "tags": ["Lends"],
                "summary": "Aktualisiert eine Ausleihe",
                "responses": {
                    "200": {
                        "description": "Ausleihe wurde aktualisiert"
                    }
                }
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ["./Tag 1/books.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
    const swaggerFile = require('./swagger-output.json');
    app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerFile));
    app.listen(port, () => {
        console.log(`Server läuft unter http://localhost:${port}`);
    });
});
