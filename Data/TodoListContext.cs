using Microsoft.EntityFrameworkCore;
using react_web.Models;

namespace react_web.Data
{
    public class TodoListContext : DbContext
    {
        public TodoListContext(DbContextOptions<TodoListContext> options)
            : base(options)
        {
        }

        public DbSet<TodoList> TodoLists { get; set; }
    }
}