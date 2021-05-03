using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUnitOfWork<T> where T : class
    {
        IGenircRepository<T> Entity { get; }
        Task Save();
    }
}