using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using react_web.Data;
using react_web.Models;

namespace react_web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoListController : ControllerBase
    {
        private readonly TodoListContext _context;

        public TodoListController(TodoListContext context)
        {
            _context = context;
        }

        // GET: api/TodoList
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoList>>> GetTodoLists()
        {
            return await _context.TodoLists.ToListAsync();
        }

        public static IEnumerable<CardBoard> MapTodoListtoCard(IEnumerable<TodoList> list_todolist){
            List<CardBoard> list_card = new List<CardBoard>();
            List<TodoList> todolists = list_todolist.ToList();
            for (int i = 0; i < todolists.Count; i++)
            {
                list_card.Add(new CardBoard{
                    id = $"Card{todolists[i].Id}",
                    title = todolists[i].Title,
                    description = todolists[i].ReleaseDate.ToString("dd/MM/yyyy HH:mm:ss"),
                    draggable = true,
                    metadata = todolists[i]
                });
            }
            return list_card;
        }

        // GET: api/TodoList/InProgress
        [HttpGet("InProgress")]
        public async Task<ActionResult<IEnumerable<CardBoard>>> GetTodoListsInProgress()
        {
            var todoList_model = from s in _context.TodoLists select s;
            var todoLists = await todoList_model.Where(s => s.Status == true).ToListAsync();
            return MapTodoListtoCard(todoLists).ToArray();
        }

        // GET: api/TodoList/NotInProgress
        [HttpGet("NotInProgress")]
        public async Task<ActionResult<IEnumerable<CardBoard>>> GetTodoListsNotInProgress()
        {
            var todoList_model = from s in _context.TodoLists select s;
            var todoLists = await todoList_model.Where(s => s.Status == false).ToListAsync();
            return MapTodoListtoCard(todoLists).ToArray();
        }

        // GET: api/TodoList/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoList>> GetTodoList(int id)
        {
            var todoList = await _context.TodoLists.FindAsync(id);

            if (todoList == null)
            {
                return NotFound();
            }

            return todoList;
        }

        // PUT: api/TodoList/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoList(int id, TodoList todoList)
        {
            if (id != todoList.Id)
            {
                return BadRequest();
            }

            _context.Entry(todoList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoListExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoList
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TodoList>> PostTodoList(TodoList todoList)
        {
            _context.TodoLists.Add(todoList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodoList", new { id = todoList.Id }, todoList);
        }

        // DELETE: api/TodoList/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoList(int id)
        {
            var todoList = await _context.TodoLists.FindAsync(id);
            if (todoList == null)
            {
                return NotFound();
            }

            _context.TodoLists.Remove(todoList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoListExists(int id)
        {
            return _context.TodoLists.Any(e => e.Id == id);
        }
    }
}
