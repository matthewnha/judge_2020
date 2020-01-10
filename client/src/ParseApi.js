import Parse from 'parse';

export default class ParseApi {
  static getAllProjects() {
    return Parse.Cloud.run('getAllProjects');
  }

  static getProject(projectId) {
    return Parse.Cloud.run('getProject', {projectId});
  }

  static getVotes(projectId) {
    return Parse.Cloud.run('getVotes', {projectId});
  }

  static getVoteQueue() {
    return Parse.Cloud.run('getVoteQueue');
  }

  static createVoteQueue() {
    // TODO: run this only when opening voting system; move to admin side
    return Parse.Cloud.run('createVoteQueue');
  }

  static syncVotes(projectId, categoryId, scores, cast) {
    const time = Date.now();
    const projectObjId = projectId;
    const toSync = Object.keys(scores)
      .map(category => {
        return {
          category,
          score: scores[category],
        }
      })
    return Parse.Cloud.run('saveVotes', {scores: toSync, cast, projectObjId, categoryId, time});
  }

  static async updateQueueStatus(projects) {
    let doneCount = 0;
    const votes = await ParseApi.getVotes();
    votes.forEach((vote) => {
      if (!vote.casted) {
        return;
      }

      let projectId = vote.project.id;
      doneCount++;
      projects[projectId].done = true;
    });

    return { projects, count: doneCount };
  }

  static async getGeneralCriteria() {
    return Parse.Cloud.run('getGeneralCriteria');
  }

  static async addGeneralCriteria(name, accessor, description, order, maxScore) {
    return Parse.Cloud.run('addGeneralCriteria', {name, accessor, description, order, maxScore});
  }

  static async deleteCriteria(objectId) {
    return Parse.Cloud.run('deleteCriteria', {objectId});
  }

  static async updateCriteria(objectId, update) {
    return Parse.Cloud.run('updateCriteria', {objectId, update});
  }

  static async getAllUsers() {
    return Parse.Cloud.run('getAllUsers');
  }

  /**
   * @param {string} userId objectId of user to update
   * @param {Object<string, string>} update Data to update. 
   *    Example keys: 'username', 'display_name', 'password', 'email'
   */
  static async updateUser(userId, updateData) {
    return Parse.Cloud.run('updateUser', {userId, updateData}); // todo: implement
  }

  static async getAllCategories() {
    return Parse.Cloud.run('getAllCategories');
  }

  /**
   * Get the categories that a judge is selected to vote in
   * @param {string} judgeId objectId of judge. 
   *    If left undefined, it will get the categories of the current user
   */
  static async getCategoriesOfJudge(judgeId) {
    return Parse.Cloud.run('getCategoriesOfJudge', {judgeId});
  }

  /**
   * Set and overwrite categories that judge will be voting in
   * @param {string} userId objectId of user to update
   * @param {Array<string>} categories Array of category objectIds strings
   */
  static async setCategoriesOfJudge(judgeId, categories) {
    return Parse.Cloud.run('setCategoriesOfJudge', {judgeId, categories}); // todo: implement
  }

  static async getCategory(categoryId) {
    return Parse.Cloud.run('getCategory', { categoryId }); // todo: implement
  }

  static async getCategoryCriteria(categoryId) {
    return Parse.Cloud.run('getCategoryCriteria', { categoryId }); // todo: implement
  }
}