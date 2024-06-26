const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const { connect, Schema, model } = require('mongoose');





app.listen(port, async () => {
  try {
    console.log(`Server is running ${port}`)
    await connect('mongodb+srv://Paul:Paul%40270414@cluster.1cbatru.mongodb.net/dbDemo')
    console.log("db connection established")
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});
app.use(bodyParser.json());





//AdminSchema

const adminSchemaStructure = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});
const Admin = model("adminSchema", adminSchemaStructure);



app.post("/Admin", async (req, res) => {

  const { name, email, password } = req.body
  const admin = new Admin({
    name,
    email,
    password,
  });

  let value = await admin.save();  //here model will be stored, so here we dont want to fetch it again

  res.send({
    message: value,
  });

});


app.get("/Admin", async (req, res) => {
  try {
    const admin = await Admin.find();
    res.send(admin).status(200);

  } catch (err) {
    console.error("Error Finding Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/Admin/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin).status(200);

  } catch (err) {
    console.error("Error Finding Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Admin Delete

app.delete("/:id/Admin", async (req, res) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    } else {
      res.json({ message: "Admin deleted successfully", deletedAdmin });
    }
  } catch (err) {
    console.error("Error deleting Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});












//DistrictSchema

const districtSchemaStructure = new Schema({
  name: {
    type: String,
    required: true
  }
})
const District = model("districtschema", districtSchemaStructure)

app.post('/District', async (req, res) => {
  const name = req.body.name
  const district = new District({
    name
  })
  let value = await district.save()
  res.send({
    message: value
  })
})

app.get('/District', async (req, res) => {
  try {
    const district = await District.find()
    if (district.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(district);
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})


app.get('/District/:id', async (req, res) => {
  try {
    const district = await District.findById(req.params.id)
    if (district.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(district);
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})


app.delete('/District/:id', async (req, res) => {
  try {
    const districtId = req.params.id;
    const deletedDistrict = await District.findByIdAndDelete(districtId)
    if (!deletedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }
    res.json({ message: "District deleted successfully", deletedDistrict });
  }
  catch (err) {
    console.error("Error deleting District:", err);
    res.status(500).json({ message: "Internal server error" });
  }
})








//Place Schema

const placeSchemaStructure = new Schema({
  name: {
    type: String,
    required: true
  },
  districtId: {
    type: Schema.Types.ObjectId,
    ref: 'districtschema',
    required: true
  }
})
const Place = model("placeSchema", placeSchemaStructure);

app.post('/Place', async (req, res) => {
  const { name, districtId } = req.body
  const place = new Place({
    name,
    districtId
  })
  let value = await place.save()
  res.send({
    message: value
  })
})


app.get('/Place/:id', async (req, res) => {
  try {
    const place = await Place.find({ districtId: req.params.id })
    if (place.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(place);
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})


app.delete("/Place/:id", async (req, res) => {
  try {
    const placeId = req.params.id;
    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    console.error("Error deleting Place:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}); 


app.delete("/PlaceDeleteMany/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Place.deleteMany({ districtId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No places found with the given district ID" });
    }

    res.json({ message: "Places deleted successfully", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting places:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});