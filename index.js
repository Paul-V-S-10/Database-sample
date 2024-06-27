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

app.patch("/Admin/:id", async (req, res) => {
  try {
    const { AdminName } = req.body;

    let admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        name: AdminName,
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ errors: [{ msg: "admin not found" }] });
    }

    res.json({ message: "admin updated successfully", admin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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


app.put("/District/:id", async (req, res) => {
  try {
    const { DistrictName } = req.body;

    let district = await District.findByIdAndUpdate(
      req.params.id,
      {
        name: DistrictName,
      },
      { new: true }
    );

    if (!district) {
      return res.status(404).json({ errors: [{ msg: "district not found" }] });
    }

    res.json({ message: "district updated successfully", district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});







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




//category Schema 

const categorySchemaStructure = new Schema({
  category_name: {
    type: String,
    required: true
  }
})
const Category = model("categorySchema", categorySchemaStructure)

app.post("/Category", async (req, res) => {
  try {

    const { category_name } = req.body
    const category = new Category({
      category_name
    })
    await category.save()
    res.send({
      message: "Inserted Successfully!!!"
    })
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
})

app.get("/Category", async (req, res) => {
  try {
    const category = await Category.find()
    if (category.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });

  }
})


app.get("/Category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category).status(200);

  } catch (err) {
    console.error("Error Finding Category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Category/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully", deletedCategory });
  } catch (err) {
    console.error("Error deleting Category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/Category/:id", async (req, res) => {
  try {
    const { CategoryName } = req.body;

    let category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        category_name: CategoryName,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ errors: [{ msg: "Category not found" }] });
    }

    res.json({ message: "Category updated successfully", category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});






//SubCategory Schema

const subcategorySchemaStructure = new Schema({
  subcategory_name: {
    type: String,
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'categoryschema',
    required: true
  }
})
const Subcategory = model("subcatehorySchema", subcategorySchemaStructure);

app.post("/Subcategory", async (req, res) => {

  const { subcategory_name, category_id } = req.body
  const subcategory = new Subcategory({
    subcategory_name,
    category_id
  });

  let value = await subcategory.save();

  res.send(value);

});

app.get('/Subcategory/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.find({ category_id: req.params.id })
    if (subcategory.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(subcategory);
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})

app.delete("/Subcategory/:id", async (req, res) => {
  try {
    const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ message: "Subcategory deleted successfully", deletedSubcategory });
  } catch (err) {
    console.error("Error deleting Subcategory:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/Subcategory/:id", async (req, res) => {
  try {
    const { SubcategoryName } = req.body;

    let subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      {
        subcategory_name: SubcategoryName,
      },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ errors: [{ msg: "Subcategory not found" }] });
    }

    res.json({ message: "Subcategory updated successfully", subcategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



//Brand

const brandSchemaStructure = new Schema({
  brand_name: {
    type: String,
    required: true,
  }
});
const Brand = model("brandSchema", brandSchemaStructure);

app.post("/Brand", async (req, res) => {

  const { brand_name } = req.body
  const brand = new Brand({
    brand_name,
  });

  await brand.save();

  res.send({
    message: 'Inserted Successfully',
  });

});

app.get("/Brand", async (req, res) => {
  try {
    const brand = await Brand.find();
    if (brand.length === 0) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Brand/:id", async (req, res) => {
  try {
    const brandId = req.params.id;
    const deletedBrand = await Brand.findByIdAndDelete(brandId);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json({ message: "Brand deleted successfully", deletedBrand });
  } catch (err) {
    console.error("Error deleting Brand:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/Brand/:id", async (req, res) => {
  try {
    const { BrandName } = req.body;

    let brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        brand_name: BrandName,
      },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ errors: [{ msg: "Brand not found" }] });
    }

    res.json({ message: "Brand updated successfully", brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




//User

const userSchemaStructure = new Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_password: {
    type: String,
    required: true,
    minlength: 6,
  },
  user_contact: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
  },
  user_address: {
    type: String,
    required: true,
  },
  user_photo: {
    type: String,
    required: true,
  },
  placeId: {
    type: Schema.Types.ObjectId,
    ref: 'placeschema',
    required: true
  }
});
const User = model("userSchema", userSchemaStructure);

app.post("/User", async (req, res) => {

  const { user_name, user_email, user_password, user_contact, user_address, user_photo, placeId } = req.body
  const user = new User({
    user_name,
    user_email,
    user_password,
    user_contact,
    user_address,
    user_photo,
    placeId
  });

  await user.save();

  res.send({
    message: 'Inserted Successfully',
  });

});

app.get('/User/:id', async (req, res) => {
  try {
    const user = await User.find({ placeId: req.params.id })
    if (user.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  }
  catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
})


app.delete("/User/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.deleteMany({ placeId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No Users found with the given place ID" });
    }

    res.json({ message: "User deleted successfully", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting places:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/User/:id", async (req, res) => {
  try {
    const { userName } = req.body;

    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        user_name: userName,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "user not found" }] });
    }

    res.json({ message: "user updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});





//Product

const productSchemaStructure = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_details: {
    type: String,
    required: true,
  },
  product_price: {
    type: String,
    required: true,
  },
  product_photo: {
    type: String,
    required: true,
  },
  brand_id: {
    type: String,
    required: true,
  },
  subcategory_id: {
    type: String,
    required: true,
  }
});

const Product = model("productSchema", productSchemaStructure);

app.post("/Product", async (req, res) => {

  const { product_name, product_details, product_price, product_photo, brand_id, subcategory_id } = req.body
  const product = new Product({
    product_name,
    product_details,
    product_price,
    product_photo,
    brand_id,
    subcategory_id

  });

  await product.save();

  res.send({
    message: 'Inserted Successfully',
  });

});

app.get("/Product", async (req, res) => {
  try {
    const product = await Product.find();
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (err) {
    console.error("Error deleting Admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.patch("/Product/:id", async (req, res) => {
  try {
    const { product_name } = req.body;

    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        product_name,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "Product not found" }] });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Seller

const sellerSchemaStructure = new Schema({
  seller_name: {
    type: String,
    required: true,
  },
  seller_email: {
    type: String,
    required: true,
  },
  seller_contact: {
    type: String,
    required: true,
  },
  seller_password: {
    type: String,
    required: true,
  },
  seller_address: {
    type: String,
    required: true,
  },
  place_id: {
    type: String,
    required: true,
  },
  seller_photo: {
    type: String,
    required: true,
  },
  seller_proof: {
    type: String,
    required: true,
  },
  seller_status: {
    type: String,
    required: true,
  },
  seller_doj: {
    type: String,
    required: true,
  },
});

const Seller = model("sellerSchema", sellerSchemaStructure);

app.post("/Seller", async (req, res) => {

  const seller = new Seller(req.body);

  let value = await seller.save();  //here model will be stored, so here we dont want to fetch it again

  res.send({
    message: 'Inserted Successfully',
  });

});

app.get("/Seller", async (req, res) => {
  try {
    const seller = await Seller.find();
    if (seller.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/Seller/:id", async (req, res) => {
  try {
    const sellerId = req.params.id;
    const deletedSeller = await Seller.findByIdAndDelete(sellerId);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({ message: "Seller deleted successfully", deletedSeller });
  } catch (err) {
    console.error("Error deleting Seller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/Seller/:id", async (req, res) => {
  try {
    const { seller_name } = req.body;

    let seller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        seller_name,
      },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ errors: [{ msg: "Seller not found" }] });
    }

    res.json({ message: "Seller updated successfully", seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});







//Stock

const stockSchemaStructure = new Schema({
  stock_name: {
    type: String,
    required: true,
  },
  stock_quantity: {
    type: String,
    required: true,
  },
  stock_date: {
    type: String,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref:'productschema',
    required: true
  },
});

const Stock = model("stockSchema", stockSchemaStructure);

app.post("/Stock", async (req, res) => {

  const stock = new Stock(req.body);

await stock.save();  

  res.send({
      message: 'Inserted Successfully',
  });

});


app.get("/Stock", async (req, res) => {
  try {
      const stock = await Stock.find();
      if (stock.length === 0) {
          return res.status(404).json({ message: "Stock not found" });
      }
      res.status(200).json(stock);
  } catch (err) {
      res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/Stock/:id", async (req, res) => {
  try {
      const stockId = req.params.id; 
      const deletedStock = await Stock.findByIdAndDelete(stockId);

      if (!deletedStock) {
          return res.status(404).json({ message: "Stock not found" });
      }
      res.json({ message: "Stock deleted successfully", deletedStock });
  } catch (err) {
      console.error("Error deleting Stock:", err);
      res.status(500).json({ message: "Internal server error" });
  }
}); 


app.patch("/Stock/:id", async (req, res) => {
  try {
    const { stock_name } = req.body;

    let stock = await Stock.findByIdAndUpdate(
      req.params.id,
      {
        stock_name,
      },
      { new: true }
    );

    if (!stock) {
      return res.status(404).json({ errors: [{ msg: "Stock not found" }] });
    }

    res.json({ message: "Stock updated successfully", stock });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



