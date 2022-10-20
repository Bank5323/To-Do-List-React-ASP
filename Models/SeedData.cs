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
                        id = "0000000000000000",
                        title = "Hello World.",
                        description = "First Card.",
                        state = false
                    }
                );
                context.SaveChanges();
            }
        }
    }
}