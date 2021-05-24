using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Helper;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class ZwajRepository : IZwajRepository
    {
        private readonly DataContext _context;
        public ZwajRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            // _context.Update(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;

        }

        public async Task<PagedList<User>> GetUsers(PagenationParams pagenationParams)
        {
            var users = _context.Users.Include(x => x.Photos);
            return await PagedList<User>.CreateAsync(users, pagenationParams.PageNumber, pagenationParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.Id == id);
            return photo;
        }

        public async Task<Photo> GetPhotoByUser(int UserId)
        {
            return await _context.Photos.Where(u => u.UserId == UserId)
                                        .FirstOrDefaultAsync(p => p.IsMain);
        }
    }
}