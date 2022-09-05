using System;
using react_web.Models;

namespace react_web.Models
{
    public class CardBoard
    {
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }


        public bool draggable { get; set; }
        public TodoList metadata { get; set; }
    }
}