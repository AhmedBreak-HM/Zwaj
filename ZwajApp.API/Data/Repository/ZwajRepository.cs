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
            // Filter by Likers

            if (pagenationParams.likers)
            {
                var userLikers = await GetUserLikes(pagenationParams.UserId, pagenationParams.likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            // Filter by Likees

            if (pagenationParams.likees)
            {
                var userLikees = await GetUserLikes(pagenationParams.UserId, pagenationParams.likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
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


        private async Task<IEnumerable<int>> GetUserLikes(int id, bool Likers)
        {
            var user = await _context.Users.Include(u => u.likers).Include(u => u.likees)
                                     .FirstOrDefaultAsync(u => u.Id == id);
            if (Likers)
            {
                return user.likers.Where(u => u.LikeeId == id).Select(l => l.LikerId);
            }
            else
            {
                return user.likees.Where(u => u.LikerId == id).Select(l => l.LikeeId);
            }
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

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.Include(m => m.Sender).ThenInclude(u => u.Photos)
                            .Include(m => m.Recipient).ThenInclude(u => u.Photos).AsQueryable();
            switch (messageParams.MessageType)
            {
                case "Inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId);
                    break;

                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId);
                    break;

                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.IsRead == false);
                    break;
            }
            messages = messages.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public Task<IEnumerable<Message>> GetConversation(int senderId, int recipientId)
        {
            throw new NotImplementedException();
        }
    }
}