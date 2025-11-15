
class BaseController {


  example = async (req, res) => {
    try {
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

};


module.exports = {
  BaseController,
};    
