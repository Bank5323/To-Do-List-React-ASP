using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using react_web.Data;
using System;
using System.Linq;

namespace react_web.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new TodoListContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<TodoListContext>>()))
            {
                // Look for any movies.
                if (context.TodoLists.Any())
                {
                    return;   // DB has been seeded
                }

                context.TodoLists.AddRange(
                    new TodoList
                    {
                        Title = "Hello World.",
                        ReleaseDate = DateTime.Now,
                        Status = true
                    }
                );
                context.SaveChanges();
            }
        }
    }
}