using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Data;

namespace Infrastructure.Repository
{
    public class GenericRepository<T> : IGenircRepository<T> where T: class
    {
        private readonly DataContext _context;
        private DbSet<T> table = null;
        public GenericRepository(DataContext context)
        {
            _context = context;
            table = _context.Set<T>();
        }
        public async Task Add(T entity)
        {
           await table.AddAsync(entity);
        }

        public async Task<T> GetById(Guid id)
        {
           return await _context.FindAsync<T>(id);
        }

        public async Task<IEnumerable<T>> GettAll()
        {
            return await table.ToListAsync();
        }

        public async Task Remove(Guid id)
        {
            T existing = await GetById(id);
            table.Remove(existing);
        }

        public void Update(T entity)
        {
           table.Attach(entity);
           _context.Entry(entity).State = EntityState.Modified;
        }
    }

}
