using System;
using System.ComponentModel.DataAnnotations;

namespace react_web.Models
{
    public class TodoList
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Status { get; set; }

        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }
    }
}