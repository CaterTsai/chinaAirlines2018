using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;



public class response
{

    public string active { get; set; }
    public bool result { get; set; }
    public string link { get; set; }
    public string guid { get; set; }

    public response()
    {
        active = "unknow";
        result = false;
        link = "";
        guid = null;
    }
}

public partial class s_upload : System.Web.UI.Page
{
    private static string serverUrl = "https://happyholidays.china-airlines.com/";
    private static string shareUrlT = "< !DOCTYPE html><html><head><title></title><meta property =\"og:image\" content=\"{0}\" /><meta property=\"og:title\" content=\"{1}\" /><meta property=\"og:description\" content=\"{2}\" /><meta property=\"og:url\" content=\"{3}\" /></head><body><script>window.location = \"{4}\";</script></body></html>";
    protected void Page_Load(object sender, EventArgs e)
    {
        var active = Request["active"];
        response rep = new response();
        if (active == "uploadImg")
        {
            string guid = DateTime.Now.ToString("ddHHmmss") + getShortGUID();
            string imgData = Request["image"];
            
            rep.active = "uploadImg";
            rep.guid = guid;
            rep.link = createSharePage(guid);
            rep.result = checkShare(guid, ref imgData);
        }

        var repJson = JsonConvert.SerializeObject(rep);
        Response.Write(repJson);
    }

    private string getShortGUID()
    {
        string guid = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        guid = guid.Replace("/", "_").Replace("+", "-").Substring(0, 22);
        return guid;
    }

    private bool checkShare(string guid, ref string imgData)
    {
        bool result = false;
        if (!File.Exists(Server.MapPath("~/s/shareImg/" + guid + ".jpg")))
        {
            createShareImg(guid, ref imgData);
            result = true;
        }
        return result;
    }

    private string createSharePage(string guid)
    {
        string imgUrl, title, desc, url, shareUrl;
        imgUrl = serverUrl + "s/shareImg/" + guid + ".jpg";
        url = serverUrl + "s/share/" + guid + ".html";
        shareUrl = serverUrl + "share.aspx?guid=" + guid;

        title = "快用【旅人賀卡】客製化你的專屬角色";
        desc = "能自己拼貼的專屬賀卡，讓你的2019新年祝福很不一樣！";

        string sharePage = String.Format(shareUrlT, imgUrl, title, desc, url, shareUrl);
        string path = Server.MapPath("~/s/share/" + guid + ".html");
        if (!File.Exists(path))
        {
            using (StreamWriter sw = File.CreateText(path))
            {
                sw.WriteLine(sharePage);
            }
        }
        return url;
    }

    private void createShareImg(string guid, ref string imgData)
    {
        byte[] bytes = Convert.FromBase64String(imgData);
        Image img;
        using (MemoryStream ms = new MemoryStream(bytes))
        {
            //Save card
            img = Image.FromStream(ms);
            img.Save(Server.MapPath("~/s/card/" + guid + ".jpg"), ImageFormat.Jpeg);

            Bitmap bg = (Bitmap)System.Drawing.Image.FromFile(Server.MapPath("~/s/fbCover.jpg"));
            Bitmap imgBitmap = (Bitmap)Bitmap.FromStream(ms);
            using (Graphics gfx = Graphics.FromImage(bg))
            {
                gfx.Flush();
                gfx.DrawImage(imgBitmap, 316, 31, 568, 568);
            }

            bg.Save(Server.MapPath("~/s/shareImg/" + guid + ".jpg"), ImageFormat.Jpeg);
            bg.Dispose();
            imgBitmap.Dispose();
            ms.Dispose();
            bytes = null;
        }


    }
}