const hasAccess = (req,res,next)=>
{
    if(req.session.userInfo==null)
    {
        res.redirect("/user/loginPage");
    }
    else
    {
        next();
    }
}

module.exports=hasAccess;