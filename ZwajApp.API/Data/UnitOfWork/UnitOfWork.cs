using Core.Interfaces;
using Infrastructure.Repository;
using System.Threading.Tasks;
using ZwajApp.API.Data;

namespace Infrastructure.UnitOfWork
{
    public class UnitOfWork<T> : IUnitOfWork<T> where T : class
    {
        private readonly DataContext _context;
        private IGenircRepository<T> _entity;

        public UnitOfWork(DataContext context)
        {
            _context = context;
        }

        public IGenircRepository<T> Entity
        {
            get
            {
                // if (_entity is null)
                // {
                //     return _entity = new GenericRepository<T>(_context);
                // }
                // return _entity;
                
                // return _entity ??= new GenericRepository<T>(_context);
                return _entity != null ? _entity : new GenericRepository<T>(_context);
            }
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}