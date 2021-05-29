using System;
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

            // IQueryable<User> users = _context.Users.Include(x => x.Photos);
            var users = _context.Users.Include(x => x.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != pagenationParams.UserId)
                         .Where(u => u.Gender == pagenationParams.Gender);
            //  Filter by age
            if (pagenationParams.MinAge != 18 || pagenationParams.MaxAge != 99)
            {
                // convert maxAge && minAge to DateTime 
                var minDate = DateTime.Today.AddYears(-pagenationParams.MaxAge - 1);
                var maxDate = DateTime.Today.AddYears(-pagenationParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDate && u.DateOfBirth <= maxDate);
            }

            // FilterBy LastActive or Created
            if (!string.IsNullOrEmpty(pagenationParams.OrederBy))
            {
                switch (pagenationParams.OrederBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;

                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }

            }

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

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.likes
                                 .FirstOrDefaultAsync(l => l.LikerId == userId && l.LikeeId == recipientId);
        }
    }
}