using System;
using System.ComponentModel.DataAnnotations;

namespace react_web.Models
{
    public class TodoList
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string label { get; set; }
        public bool state { get; set; }

        // [DataType(DataType.Date)]
        // public DateTime ReleaseDate { get; set; }

        public TodoList(){
            title = "Untitle";
            description = "";
            label = "";
        }
    }
}