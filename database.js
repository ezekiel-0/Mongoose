// Importation de Mongoose
const mongoose = require('mongoose');

// Configuration de Mongoose et connexion à la base de données MongoDB en utilisant l'URI stockée dans le fichier .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Création du schéma de personne
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Le nom de la personne est une chaîne de caractères obligatoire
  age: { type: Number }, // L'âge de la personne est un nombre
  favoriteFoods: { type: [String] } // La liste des aliments préférés est un tableau de chaînes de caractères
});

// Création du modèle de personne
const Person = mongoose.model('Person', personSchema);
// Création d'un modèle de données basé sur le schéma de personne

// Fonction pour créer et sauvegarder un enregistrement d'un modèle
const createPerson = (name, age, favoriteFoods, done) => {
  // Création d'une nouvelle instance de personne en utilisant le modèle Person
  const person = new Person({ name, age, favoriteFoods });
  // Enregistrement de la personne dans la base de données
  person.save((err, data) => {
    // Rappel appelé une fois que l'opération est terminée
    if (err) return console.error(err); // Gestion des erreurs
    done(null, data); // Renvoi des données enregistrées
  });
};

// Fonction pour créer plusieurs enregistrements avec model.create()
const createPeople = (arrayOfPeople, done) => {
  // Création de plusieurs personnes en une seule fois et enregistrement dans la base de données
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, data); // Renvoi des données enregistrées
  });
};

// Fonction pour rechercher des personnes par leur nom dans la base de données
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, data); // Renvoi des données trouvées
  });
};

// Fonction pour rechercher une personne par un aliment préféré dans la base de données
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, data); // Renvoi des données trouvées
  });
};

// Fonction pour rechercher une personne par son identifiant unique dans la base de données
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, data); // Renvoi des données trouvées
  });
};

// Fonction pour trouver une personne par son identifiant, ajouter un aliment à ses aliments préférés et sauvegarder les modifications
const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err); // Gestion des erreurs
    person.favoriteFoods.push("hamburger"); // Ajout d'un aliment aux aliments préférés de la personne
    person.save((err, updatedPerson) => {
      if (err) return console.error(err); // Gestion des erreurs
      done(null, updatedPerson); // Renvoi des données mises à jour
    });
  });
};

// Fonction pour trouver une personne par son nom, mettre à jour son âge et renvoyer le document mis à jour
const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName }, // Recherche par nom
    { age: 20 }, // Mise à jour de l'âge
    { new: true }, // Renvoi du document mis à jour
    (err, updatedPerson) => {
      if (err) return console.error(err); // Gestion des erreurs
      done(null, updatedPerson); // Renvoi des données mises à jour
    }
  );
};

// Fonction pour supprimer une personne par son identifiant unique
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, removedPerson); // Renvoi de la personne supprimée
  });
};

// Fonction pour supprimer plusieurs personnes en fonction d'un critère (ici, le nom est "Mary")
const removeManyPeople = (done) => {
  Person.remove({ name: "Mary" }, (err, result) => {
    if (err) return console.error(err); // Gestion des erreurs
    done(null, result); // Renvoi du résultat de l'opération
  });
};

// Fonction pour rechercher des personnes qui aiment les burritos, trier les résultats par nom, limiter les résultats à deux documents et masquer leur âge
const queryChain = (done) => {
  Person.find({ favoriteFoods: "burritos" }) // Recherche des personnes aimant les burritos
    .sort({ name: 1 }) // Tri par nom (ordre alphabétique croissant)
    .limit(2) // Limiter les résultats à deux documents
    .select("-age") // Masquer l'âge
    .exec((err, data) => {
      if (err) return console.error(err); // Gestion des erreurs
      done(null, data); // Renvoi des données trouvées
    });
};

// Exportation des fonctions pour les utiliser dans d'autres fichiers
module.exports = {
  createPerson,
  createPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};
