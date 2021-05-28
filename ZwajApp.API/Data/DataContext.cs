using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Value> values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> likes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Like>()
                .HasKey(bc => new { bc.LikerId, bc.LikeeId });
            builder.Entity<Like>()
                .HasOne(bc => bc.Likee)
                .WithMany(b => b.likers)
                .HasForeignKey(bc => bc.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Like>()
                .HasOne(bc => bc.Liker)
                .WithMany(c => c.likees)
                .HasForeignKey(bc => bc.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }


}